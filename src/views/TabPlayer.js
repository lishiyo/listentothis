/**
Smart component that wraps a GridVideoTile with iframe data and handles player behavior.

props: {
  id: '3ybh3d',
  url: "http://comforterband.bandcamp.com/track/cop-2",
  title: 'Hello',
  author: 'AdeleFan',
  score: 145,
  media_embed: {
    content: '&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=...',
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

const mapStateToProps = (state) => ({
  videoList: state.videoList,
  readyPlayers: state.players.readyPlayers,
  failedPlayerCount: state.players.failedPlayerCount
})

export class TabPlayer extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    score: React.PropTypes.number,
    media_embed: React.PropTypes.object.isRequired,
    addReadyPlayer: React.PropTypes.func.isRequired,
    addFailedPlayer: React.PropTypes.func.isRequired,
    setAllReady: React.PropTypes.func.isRequired,
    videoList: React.PropTypes.array.isRequired,
    readyPlayers: React.PropTypes.array.isRequired,
    failedPlayerCount: React.PropTypes.number.isRequired
  }

  handleIframeReady (iframeTag) { // iframe rendered
    if (iframeTag) {
      this._createPlayer(iframeTag)
    } else {
      console.log('TabPlayer handleIframeReady did NOT get iframeTag')
      // failed player event
      this.props.addFailedPlayer(1)
    }
  }

  _createPlayer (iframeTag) {
    const {
      addReadyPlayer,
      addFailedPlayer,
      setAllReady
    } = this.props

    const player = new window.playerjs.Player(iframeTag)
    player.on('ready', () => {
      // player ready event
      addReadyPlayer(player)
      player.unmute()
      if (this._checkAllReady()) {
        console.log('all ready', this.props.readyPlayers)
        setAllReady(true)
        const multi = new window.$Player(this.props.readyPlayers)
        multi.unmute()
        multi.play(11) // random index
      }
      // player.play()
    })
    player.on('error', () => {
      console.log('PLAYER FAILED: ' + this.props.author)
      addFailedPlayer(1)
    })
  }

  _checkAllReady () {
    const {
      videoList,
      readyPlayers,
      failedPlayerCount
    } = this.props
    console.log('check all ready: ', readyPlayers.length, failedPlayerCount, videoList.length)
    return readyPlayers && videoList && (readyPlayers.length + failedPlayerCount === videoList.length)
  }

  _createIframeData () {
    if (this.iframe) {
      return this.iframe
    }

    // decode iframe string, convert to html node
    const iframeStr = this._decodeEmbed()
    if (iframeStr) {
      this.iframe = this._parseEmbedToTag(iframeStr)
      return this.iframe
    }

    return null // last ditch
  }

  _decodeEmbed () { // html-entities decode
    if (this.props.media_embed.content) {
      return he.decode(this.props.media_embed.content)
    }
  }

  _parseEmbedToTag (iframeStr) { // convert string to real <iframe>
    const wrapper = document.createElement('div')
    wrapper.innerHTML = iframeStr
    return wrapper.firstChild
  }

  render () {
    const iframeData = this._createIframeData()

    const {
      id,
      title,
      author
    } = this.props

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

export default connect(
  mapStateToProps,
  actionCreators)(TabPlayer) // just actions, no state
