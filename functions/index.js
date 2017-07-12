const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Immutable = require('immutable');

admin.initializeApp(functions.config().firebase);

const database = admin.database();

const getRandomCard = cards => cards.get(Math.floor(Math.random() * Math.floor(cards.size)));

const isMythicRare = () => Math.floor(Math.random() * Math.floor(7)) === 1;

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
        .once('value', boosterSnapshot => cardRef
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
                  console.log(packNumber, seatIndex);
                  if (packNumber % 2) {
                    seatIndex += 1; // right on 1
                  } else {
                    seatIndex -= 1; // left on 0 and 2
                  }
                  console.log(seatIndex);
                  const seatToPass = seats.get(seatIndex % (seats.count()));
                  return database
                    .ref(`seats/${seatToPass}/boosterQueue`)
                    .push(boosterId)
                    .then(() => {
                      console.log('done');
                      res.send('done');
                    });
                }),
              ),
            ),
          ),
        ),
      );
  }),
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
            .then((boosterRef) => {
              console.log(boosterRef.key);
              res.send(boosterRef.key);
              return database.ref(`seats/${seatId}/boosterQueue`).push(boosterRef.key);
              // await firebase.set(`/seats/${seatId}/pickNumber`, 1);
              // await firebase.set(`/seats/${seatId}/packNumber`, packNumber + 1);
            });
        }),
      ),
    );
  }),
);
