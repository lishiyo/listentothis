/**
Presentational component to render a single embed, given id, URL, title, and author (author).

props: {
  id: '3ybh3d',
  title: 'Hello',
  author: 'AdeleFan',
  iframeData: <iframe width='350' height='250' ../>
  iframeReadyCb: function
}

**/

import React from 'react'
import GridTile from 'material-ui/lib/grid-list/grid-tile'

export class GridVideoTile extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    iframeReadyCb: React.PropTypes.func.isRequired,
    iframeData: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  }

  componentDidMount () {
    // after iframe has been set inside GridVideoTile
    this.props.iframeReadyCb(this.refs.iframeRef)
  }

  render () {
    const {
      title,
      author,
      id,
      iframeData
    } = this.props

    const {
      src,
      width,
      height
    } = iframeData

    return (
        <GridTile
          title={title}
          subtitle={<span>by <b>{author}</b></span>}>
          { iframeData &&
             <iframe
               id={id}
               ref='iframeRef'
               src={src}
               width={width}
               height={height}
               className='embedly-embed'
               scrolling='no'
               frameBorder='0'
               allowFullScreen
             ></iframe>
           }
        </GridTile>
    )
  }
}

export default GridVideoTile
