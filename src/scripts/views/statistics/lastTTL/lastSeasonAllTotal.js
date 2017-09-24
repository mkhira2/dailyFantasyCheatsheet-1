import React from 'react'
import Backbone from 'backbone'
import $ from 'jquery'
import Tablesorter from 'tablesorter'
import STORE from '../../../store'
import ReactTooltip from 'react-tooltip'

var lastSeasonAllData = require('../../../data.json').lastSeasonAlldata

var LastSeasonAllTotal = React.createClass({
  	render: function() {
  		// Hide All table if All Button is not active
  		if (this.props.showAllStats === false) {
    		return null
    	}
	    return (
	      	<div className='stat-container'>
				<div className='stat-table'>
			        <table id="complete">
						<Headers />
						<Body  data={lastSeasonAllData}/>
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
      	<thead>
	        <tr>
				<th id='widen-th'><span id='th-pointer' data-tip="Player Name">PLAYER</span><i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th><span id='th-pointer' data-tip="Team Name">TEAM</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Player Position">POS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Games Played">GP</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Pass Attempts">PATT</span><i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th><span id='th-pointer' data-tip="Pass Completions">PCMP</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Passing Yards">PYDS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th><span id='th-pointer' data-tip="Passing Touchdowns">PTDS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Interceptions">PINT</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Play Action %">PA%</span><i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th><span id='th-pointer' data-tip="Rushing Attempts">RUATT</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Rushing Yards">RUYDS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Rushing Touchdowns">RUTDS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Receptions">REC</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Receiving Yards">REYRD</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Receiving Touchdowns">RETDS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th><span id='th-pointer' data-tip="Fantasy Points">FPTS</span><i className="fa fa-caret-down" aria-hidden="true"></i></th>
	        </tr>
      	</thead>
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
				<td>{player.pos}</td>
				<td>{player.gp}</td>
				<td>{player.att}</td>
				<td>{player.cmp}</td>
				<td>{player.payds}</td>
				<td>{player.patd}</td>
				<td>{player.int}</td>
				<td>{player.pct}</td>
				<td>{player.ruatt}</td>
				<td>{player.ruyds}</td>
				<td>{player.rutd}</td>
				<td>{player.rec}</td>
				<td>{player.reyds}</td>
				<td>{player.retd}</td>
				<td>{player.fpts}</td>
              </tr>
            )
         })}
      </tbody>
    );
  }
})

export default LastSeasonAllTotal