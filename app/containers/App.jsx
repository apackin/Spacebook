import React, { PropTypes } from 'react';
import Navigation from 'containers/Navigation';
import SpaceControl from 'containers/SpaceControl';
import Message from 'containers/Message';
import classNames from 'classnames/bind';
import styles from 'css/main';

const cx = classNames.bind(styles);


/*
 * React-router's <Router> component renders <Route>'s
 * and replaces `this.props.children` with the proper React Component.
 *s
 * Please refer to `routes.jsx` for the route config.
 *
 * A better explanation of react-router is available here:
 * https://github.com/rackt/react-router/blob/latest/docs/Introduction.md
 */
const App = ({children}) => {
  // <Navigation /> // placed in space controller container so it can inherit props
  return (
    <div className={cx('app')}>
        {children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object
};

export default App;
