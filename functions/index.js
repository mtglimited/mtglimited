const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Immutable = require('immutable');

admin.initializeApp(functions.config().firebase);

const database = admin.database();

const getRandomCard = cards => cards.get(Math.floor(Math.random() * Math.floor(cards.size)));

const isMythicRare = () => Math.floor(Math.random() * Math.floor(7)) === 1;

const incrementSeatPickNumber = (seatId, pickNumber) => database
  .ref(`seats/${seatId}`)
  .update({
    pickNumber: pickNumber + 1,
  });

const passPack = (seatToPass, boosterId) => database
  .ref(`seats/${seatToPass}/boosterQueue`)
  .push(boosterId);

exports.pickCard = functions.https.onRequest(({ query: { seatId, cardIndex } }, res) => database
  .ref(`seats/${seatId}`).once('value', (seatSnapshot) => {
    const seat = Immutable.fromJS(seatSnapshot.val());
    const packNumber = seat.get('packNumber', 0);
    const pickNumber = seat.get('pickNumber', 0);
    const roomId = seat.get('room');
    const owner = seat.get('owner');
    const boosterKey = seat.get('boosterQueue').keySeq().first();
    const boosterId = seat.getIn(['boosterQueue', boosterKey]);

    const cardRef = database.ref(`boosters/${boosterId}/cards/${cardIndex}`);
    const boosterRef = database.ref(`boosters/${boosterId}`);
    const roomSeatsRef = database.ref(`rooms/${roomId}/seats`);
    const collectionCardsRef = database.ref(`collections/${seat.get('collection')}/cards`);

    return database
      .ref(`seats/${seatId}/boosterQueue/${boosterKey}`)
      .remove(() => boosterRef
        .once('value', (boosterSnapshot) => {
          const cards = Immutable.fromJS(boosterSnapshot.val().cards);
          const unpickedCards = cards.filterNot(card => card.get('pickNumber') >= 0);
          return cardRef
            .update({
              pickNumber,
              owner,
            })
            .then(() => cardRef
              .once('value', cardSnapshot => collectionCardsRef
                .push({
                  pickNumber: cardSnapshot.val().pickNumber,
                  data: cardSnapshot.val().data,
                  set: boosterSnapshot.val().set,
                })
                .then(() => roomSeatsRef
                  .once('value', (roomSeatsSnapshot) => {
                    const seats = Immutable.fromJS(roomSeatsSnapshot.val());
                    let seatIndex = seats.findKey(id => id === seatId);

                    if (packNumber % 2) {
                      seatIndex += 1; // right on 1
                    } else {
                      seatIndex -= 1; // left on 0 and 2
                    }

                    const seatToPass = seats.get(seatIndex % (seats.count()));
                    return incrementSeatPickNumber(seatId, pickNumber)
                      .then(() => {
                        if (unpickedCards.count() > 1) {
                          return passPack(seatToPass, boosterId).then(() => res.send('done'));
                        }

                        return res.send('done, did not pass pack');
                      });
                  })
                )
              )
            );
        })
      );
  })
);

exports.openBoosterPack = functions.https.onRequest(({ query: { seatId } }, res) => database
  .ref(`seats/${seatId}`).once('value', (seatSnapshot) => {
    const seat = Immutable.fromJS(seatSnapshot.val());
    const packNumber = seat.get('packNumber');
    const owner = seat.get('owner');
    const roomId = seat.get('room');

    return database.ref(`rooms/${roomId}`).once('value', roomSnapshot => database
      .ref(`sets/${roomSnapshot.val().set}/draftOrder/${packNumber}`).once('value', setIdSnapshot => database
        .ref(`sets/${setIdSnapshot.val()}`).once('value', (setSnapshot) => {
          const set = Immutable.fromJS(setSnapshot.val());
          const cardsByRarity = set.get('cards').groupBy(card => card && card.get('rarity').toLowerCase());
          const boosterCards = set.get('booster')
            .filterNot(rarity => rarity === 'land' || rarity === 'marketing')
            .map((rarity) => {
              let rarityKey = rarity;

              if (typeof rarity === 'object') {
                rarityKey = isMythicRare() ? 'mythic rare' : 'rare';
              }

              const cardChoices = cardsByRarity.get(rarityKey);
              const randomCard = getRandomCard(cardChoices);
              const randomCardIndex = set.get('cards').findKey(card => card && card.get('id') === randomCard.get('id'));

              return {
                data: randomCardIndex,
              };
            });

          const booster = {
            cards: boosterCards.toJS(),
            owner,
            roomId,
            seatId,
            set: setIdSnapshot.val(),
          };

          return database
            .ref('boosters')
            .push(booster)
            .then(boosterRef => database
              .ref(`seats/${seatId}/boosterQueue`)
              .push(boosterRef.key)
              .then(() => database
                .ref(`seats/${seatId}`)
                .update({
                  pickNumber: 1,
                  packNumber: packNumber + 1,
                })
                .then(() => res.send('done'))
              )
            );
        })
      )
    );
  })
);
