/**
Presentational component to render a single youtube video, given id, URL, title, and author (author).

props: {
  id: '3ybh3d',
  url: "http://comforterband.bandcamp.com/track/cop-2",
  title: 'Hello',
  author: 'AdeleFan',
  media_embed: {
    content: '',
    width: 350,
    height: 467
    scrolling: false,
  }
}

**/

import React from 'react'
import GridTile from 'material-ui/lib/grid-list/grid-tile'
import he from 'he'

export class GridVideoTile extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    media_embed: React.PropTypes.object.isRequired
  }

  // takes iframe string and turns into node, appends to div
  parseMediaEmbed (iframeContent) {
    if (!iframeContent) {
      console.log('no iframeContent! not creating player')
      return ''
    }
    return he.decode(iframeContent)
  }

  attachMediaEmbed (iframeNode) {
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(iframeNode)
    this.containerEl.appendChild(documentFragment)
    return this.containerEl.firstElementChild
  }

  createPlayer (iframeTag) {
    if (!iframeTag) {
      console.log('no iframeTag! not creating player')
      return
    }
    const player = new window.playerjs.Player(iframeTag)
    player.on('ready', () => {
      console.log('player ready! calling play')
      // player.play()
    })
  }

  componentDidMount () {
    const iframeNode = this.parseMediaEmbed(this.props.media_embed.content)
    if (iframeNode) {
      const iframeTag = this.attachMediaEmbed(iframeNode)
      this.createPlayer(iframeTag)
    }
  }

  render () {
    const {
      title,
      author
    } = this.props

    const setDivRef = (node) => {
      this.containerEl = node
    }

    return (
        <GridTile
          title={title}
          subtitle={<span>by <b>{author}</b></span>}>
          <div ref={setDivRef.bind(this)} ></div>
        </GridTile>
    )
  }
}

export default GridVideoTile
