/**
Smart component wrapping a tab with a GridVideoList to the array of videos.

Note that this is mounted as soon as TabsContainer renders, even if the tab is not visible.
*/
import React from 'react'
import { connect } from 'react-redux'
import GridVideoList from '../components/GridVideoList'

const mapStateToProps = (state) => ({
  videoList: state.videoList
})

export class TabGrid extends React.Component {
  static propTypes = {
    videoList: React.PropTypes.array.isRequired,
    value: React.PropTypes.string.isRequired
  }

  render () {
    return (
      <GridVideoList
      videoList={this.props.videoList} />
    )
  }
}

export default connect(
  mapStateToProps)(TabGrid)
