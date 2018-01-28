import * as React from 'react';

storyOf('Input', () => <div>My Component</div>);

// you can group tests using BDD approach, with each describe generating one folder in
describe('Folder', function() {
  storyOf(
    'Component With Test',
    {
      foo: 2,
      bar: 3,
      get component() {
        // just another notation
        return <div>My Tested</div>;
      }
    },
    data => {
      it('passes', () => {
        expect(data.foo).toEqual(2);
      });

      it('fails', () => {
        expect(data.bar).toEqual(3);
      });
    }
  );

  storyOf(
    'Other Component',
    {
      get component() {
        return (
          <div>Other Component 7</div>
        );
      }
    },
    data => {
      it('renders correctly', function() {
        expect(data.component).toMatchSnapshot();
      });

      it('renders other', function() {
        expect(data.component).toMatchSnapshot();
      });
    }
  );
});
