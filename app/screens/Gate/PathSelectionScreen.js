import React from 'react';
import EntryStaticScreen from './_EntryStaticScreen';

export default function PathSelectionScreen() {
  return (
    <EntryStaticScreen
      title="CHOOSE YOUR PATH"
      subtitle="Begin by logging in or creating a new account."
      asset={require('../../assets/finalux/path_selection.png')}
      primaryLabel="Log In"
      primaryRoutes={['Login']}
      secondaryLabel="Sign Up"
      secondaryRoutes={['Signup']}
    />
  );
}
