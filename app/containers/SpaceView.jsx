import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import BottomBar from 'components/BottomBar';
import SpaceControl from 'containers/SpaceControl';

import * as Actions from '../actions/spacecontrols';




class SpaceView extends Component {
  constructor(props, context) {
    super(props, context);
  }

  // componentWillMount() {
  //   if (!this.props.space) {
  //     this.props.dispatch(Actions.getSpace(this.props.params.spaceId));
  //   }
  // }

  render() {
    return (
        <div>
          <SpaceControl spaceId={this.props.params.spaceId} />

        </div>
    );
  }
}



function mapStateToProps(store) {
  return {
  };
}

export default connect(mapStateToProps)(SpaceView);
