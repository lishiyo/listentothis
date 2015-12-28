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
import GridVideoTile from './GridVideoTile'

export class GridvideoList extends React.Component {
  static propTypes = {
    videoList: React.PropTypes.array
  }

  render () {
    const {
      videoList
    } = this.props

    const renderVideoTile = (arrayItem, idx) => {
      let item = arrayItem.data

      return (
        <GridVideoTile
          id={item.id}
          key={item.id}
          title={item.title}
          author={item.author}
          url={item.url}
          media_embed={item.media_embed} />
      )
    }

    return (
      <GridList
        cols={2}
        cellHeight={250}
        padding={3}
        >
        {
          videoList.map(renderVideoTile)
        }
      </GridList>
    )
  }
}

export default GridvideoList
