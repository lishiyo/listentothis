/**
Presentational component to render a grid list of youtube videos, given an array of data:

{
  id: '3ybh3d'
  title: 'Hello',
  author: 'AdeleFan',
  url: 'http://www.youtube.com/embed/M7lc1UVf-VE',
  media_embed: {
    content: ''
  }
}

**/

import React from 'react'
import GridList from 'material-ui/lib/grid-list/grid-list'
import TabPlayer from '../views/TabPlayer'
import { take } from 'lodash'
import { videoListsEqual } from '../redux/utils/helpers'

export class GridVideoList extends React.Component {
  static propTypes = {
    videoList: React.PropTypes.array
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('GridVideoList are videoListsEqual?', videoListsEqual(
      nextProps.videoList,
      this.props.videoList
    ))
    return !videoListsEqual(
      nextProps.videoList,
      this.props.videoList
    )
  }

  render () {
    const {
      videoList
    } = this.props

    console.log('GridVideoList RENDER ++ videoList', videoList)

    const renderVideoTile = (item, idx) => {
      const data = item.data
      return (
        <TabPlayer
          id={data.id}
          url={data.url}
          title={data.title}
          author={data.author}
          media_embed={data.media_embed}
          score={item.score}
          key={data.id} />
      )
    }

    return (
      <GridList
        cols={2}
        cellHeight={250}
        padding={3}
        >
        {
          take(videoList, 4).map(renderVideoTile)
        }
      </GridList>
    )
  }
}

export default GridVideoList
