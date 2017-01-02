import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import NotFound from './NotFound';

jest.mock('components/BasicLayout', () => 'BasicLayout');

let wrapper;

describe('<NotFound />', () => {
  beforeEach(() => {
    wrapper = shallow(<NotFound />);
  });

  it('is using the BasicLayout', () => {
    expect(wrapper.type()).toBe('BasicLayout');
  });

  it('a single child element is passed to the layout', () => {
    expect(wrapper.children.length).toBe(1);
  });

  it('a header and paragraph', () => {
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('p').length).toBe(1);
  });

  it('should match the snapshot', () => {
    const renderedComponent = renderer.create(<NotFound />);
    const tree = renderedComponent.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
