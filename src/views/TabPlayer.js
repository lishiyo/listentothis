/**
Smart component that sends the iframe data to GridVideoTile and handles player behavior.

props: {
  id: '3ybh3d',
  url: "http://comforterband.bandcamp.com/track/cop-2",
  title: 'Hello',
  author: 'AdeleFan',
  score: 145,
  media_embed: {
    content: '',
    width: 350,
    height: 467
    scrolling: false,
  }
}

*/

import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from '../redux/modules/players'
import GridVideoTile from '../components/GridVideoTile'
import he from 'he'

export class TabPlayer extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    score: React.PropTypes.number,
    media_embed: React.PropTypes.object.isRequired
  }

  handleIframeReady (iframeTag) {
    if (iframeTag) {
      console.log('TabPlayer handleIframeReady for: ' + this.props.author)
      this.createPlayer(iframeTag)
    } else {
      console.log('TabPlayer handleIframeReady did NOT get iframeTag')
    }
  }

  createPlayer (iframeTag) {
    if (!iframeTag) {
      console.log('no iframeTag! not creating player')
      return
    }
    const player = new window.playerjs.Player(iframeTag)
    player.on('ready', () => {
      console.log('PLAYER READY')
      // player.play()
    })
  }

  getIframeData () {
    if (this.iframe) {
      return this.iframe
    }

    // decode iframe string, convert to html node
    const iframeStr = this.decodeEmbed()
    if (iframeStr) {
      this.iframe = this.parseEmbedToTag(iframeStr)
      return this.iframe
    }

    return null // last ditch
  }

  decodeEmbed () { // decode html-entities
    if (this.props.media_embed.content) {
      return he.decode(this.props.media_embed.content)
    }
  }

  parseEmbedToTag (iframeStr) { // convert string to real <iframe>
    const wrapper = document.createElement('div')
    wrapper.innerHTML = iframeStr
    return wrapper.firstChild
  }

  render () {
    const iframeData = this.getIframeData()

    const {
      id,
      title,
      author
    } = this.props

    console.log('TabPlayer render! author: ' + author)

    return (
        <GridVideoTile
          title={title}
          author={author}
          id={id}
          iframeData={iframeData}
          iframeReadyCb={this.handleIframeReady.bind(this)} />
    )
  }
}

export default connect(actionCreators)(TabPlayer)
