import React from 'react'
import Backbone from 'backbone'
import $ from 'jquery'
import Tablesorter from 'tablesorter'
import STORE from '../../../store'
import TeTable from '../components/teTable'
import ReactTooltip from 'react-tooltip'

var seasonTEData = require('../../../data.json').tedata

var CurrentSeasonTEPPG = React.createClass({
  	render: function() {
  		// Hide TE table if TE Button is not active
  		if (this.props.showTEStats === false) {
    		return null
    	}
    	if (seasonTEData.length < 2) {
    		return (
    			<div className='no-data'>
    				<h4>There are currently no stats to display</h4>
		            <p>
		              Check back after the season has started<br />
		              or select 'Last Season' above to view last season's stats.
		            </p>
    			</div>
    		)
    	}
	    return (
	      	<div className='stat-container'>
				<div className='stat-table'>
			        <table id="complete">
						<Headers />
						<Body  data={seasonTEData}/>
			        </table>
	      		</div>
	      		<ReactTooltip place="bottom" effect="solid" multiline={true} offset={{bottom: 20, right: 9}}/>
	      </div>
	    ) 
	}
})

var Headers = React.createClass({
  componentDidMount: function() {
    $("#complete").tablesorter();
  },
  render: function () {
    return (
      	<TeTable />
    )
  }
})

var Body = React.createClass({
  render: function() {
  	var preSortedData = this.props.data.sort(function(a,b){return b.fpts - a.fpts})
    return (
      <tbody>
        {preSortedData.map(function(player, i) {
            return (
              <tr key={i}>
                <td id='align-left'>{player.player}</td> 
				<td>{player.team}</td>
				<td>{player.gp}</td>
				<td>{(player.tar/player.gp).toFixed(2)}</td>
				<td>{(player.rec/player.gp).toFixed(2)}</td>
				<td>{(player.reyds/player.gp).toFixed(2)}</td>
				<td>{(player.reypc/player.gp).toFixed(2)}</td>
				<td>{(player.retd/player.gp).toFixed(2)}</td>
				<td>{(player.ruatt/player.gp).toFixed(2)}</td>
				<td>{(player.ruyds/player.gp).toFixed(2)}</td>
				<td>{(player.ruypc/player.gp).toFixed(2)}</td>
				<td>{(player.rutd/player.gp).toFixed(2)}</td>
				<td>{(player.tchs/player.gp).toFixed(2)}</td>
				<td>{(player.tyds/player.gp).toFixed(2)}</td>
				<td>{(player.fpts/player.gp).toFixed(2)}</td>
              </tr>
            )
         })}
      </tbody>
    );
  }
})

export default CurrentSeasonTEPPG