import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators as tabActions } from '../redux/modules/tabs'
import { actionCreators as dataActions } from '../redux/modules/data'
import { getVideos } from '../redux/modules/data'
import FILTERS from '../data/constants'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import styles from './TabsContainer.scss'
// import TabGrid from './TabGrid'
import GridVideoList from '../components/GridVideoList'

/**
{
  currentTab: {
    title: "tab title",
    value: "hot"
  },
}
**/
const mapStateToProps = (state) => ({
  tabTitle: state.currentTab.title,
  tabFilter: state.currentTab.value
})

// Combine tab and data action creators
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    Object.assign(
      {},
      tabActions,
      dataActions),
    dispatch)
}

export class TabsContainer extends React.Component {
  static propTypes = {
    tabTitle: React.PropTypes.string.isRequired,
    tabFilter: React.PropTypes.string.isRequired,
    setCurrentTab: React.PropTypes.func.isRequired,
    setActiveVideos: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    // populate initial tab
    // TODO - filter to actual initial tab rather than default filter
    this.updateTab(FILTERS.FILTER_DEFAULT)
  }

  updateTab (value) {
    const {
      setCurrentTab,
      setActiveVideos
    } = this.props

    setCurrentTab(value)
    setActiveVideos(value)
  }

  render () {
    const {
      tabFilter
    } = this.props

    return (
      <div className='container text-center'>
        <Tabs
          value={tabFilter}
          onChange={this.updateTab.bind(this)}
        >
          <Tab
            label='HOT'
            value={FILTERS.FILTER_HOT}
            selected>
              <h2 className={styles['headline']}>HOT</h2>
              <GridVideoList
                videoList={getVideos(FILTERS.FILTER_HOT)}
              />
          </Tab>
          <Tab
            label='TOP'
            value={FILTERS.FILTER_TOP}>
              <h2 className={styles['headline']}>TOP</h2>
              <GridVideoList
                videoList={getVideos(FILTERS.FILTER_TOP)}
              />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
// transforms state fields and actions into this.props
export default connect(
  mapStateToProps,
  mapDispatchToProps)(TabsContainer)
