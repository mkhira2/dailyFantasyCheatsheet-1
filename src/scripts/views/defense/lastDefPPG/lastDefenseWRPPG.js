import React from 'react'
import Backbone from 'backbone'
import $ from 'jquery'
import Tablesorter from 'tablesorter'
import STORE from '../../../store'

var wrDefense = require('../../../data.json').wrDefenseLastSeason

var LastDefenseWRPPG = React.createClass({
  	render: function() {
  		// Hide WR table if WR Button is not active
  		if (this.props.showWRDef === false) {
    		return null
    	}
	    return (
	      	<div className='stat-container'>
				<div className='stat-table'>
			        <table id="complete">
						<Headers />
						<Body  data={wrDefense}/>
			        </table>
	      		</div>
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
				<th id='widen-th' >TEAM<i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th>GP<i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th>TAR<i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th>REC<i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th>REYDS<i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th>RETDS<i className="fa fa-caret-down" aria-hidden="true"></i></th> 
				<th>RUATT<i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th>RUYDS<i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th>RUTDS<i className="fa fa-caret-down" aria-hidden="true"></i></th>
				<th>FPTS<i className="fa fa-caret-down" aria-hidden="true"></i></th>
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
                <td id='align-left'>{player.team}</td> 
				<td>{player.gp}</td>
				<td>{(player.tar/player.gp).toFixed(2)}</td>
				<td>{(player.rec/player.gp).toFixed(2)}</td>
				<td>{(player.reyds/player.gp).toFixed(2)}</td>
				<td>{(player.retd/player.gp).toFixed(2)}</td>
				<td>{(player.ruatt/player.gp).toFixed(2)}</td>
				<td>{(player.ruyds/player.gp).toFixed(2)}</td>
				<td>{(player.rutd/player.gp).toFixed(2)}</td>
				<td>{(player.fpts/player.gp).toFixed(2)}</td>
              </tr>
            )
         })}
      </tbody>
    );
  }
})

export default LastDefenseWRPPG