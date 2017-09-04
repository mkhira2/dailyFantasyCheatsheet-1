import STORE from './store'
import Backbone from 'backbone'
import {Contest} from './models/contestModel'
import numeral from 'numeral'
import moment from 'moment'
import $ from 'jquery'
import User from './models/userModel'

var dvoa = require('../../data/team_defense_dvoa.json')
var seasonQBData = require('./data.json').lastSeasonQBdata
var seasonRBData = require('./data.json').lastSeasonRBdata
var seasonWRData = require('./data.json').lastSeasonWRdata
var seasonTEData = require('./data.json').lastSeasonTEdata
var seasonDFData = require('./data.json').lastSeasonDFdata

var ACTIONS = {
	//============================================//
	//----------- CHEATSHEET DATA ----------------//
	//============================================//

	//Filter QB Data to only return players with a weekly DK salary
	filterQbBySalary: function(newArr) {
		function hasSalary(obj) {
			return obj !== null
		}
		function filterBySalary(item) {
		  if (item.salary) {
		    return true;
		  }
		  return false;
		}
		var qbArrBySalary = newArr.filter(filterBySalary);
		return qbArrBySalary
	},

	//Create QB Cheatsheet Object
	qbAnalyzer: function(qbs, arr2, arr3, proj) {
	    var newArr = []
      var dvoaResults = this.sortdvoa()
      var yardsCounter = 0
	    for (var i = 0; i < qbs.length; i++) {
	        var newObj = {}
	        newObj["id"] = qbs[i].id
	        newObj["player"] = qbs[i].player
	        newObj["team"] = this.getTeamName(qbs[i].team)
	        newObj["opp"] = qbs[i].opp
	        if (qbs[i].opp === "N\/A") {
	        	newObj["opp"] = "Bye Week"
	        } else {
	        	newObj["opp"] = qbs[i].opp
	        }
	        // newObj["salary"] = qbs[i].salary
	        newObj["fppg"] = qbs[i].fpts/qbs[i].gp
	        if (newObj["opp"].charAt(0) === "@") {
	        	newObj["ha"] = "Away"
	        } else if (qbs[i].opp === "N\/A") {
	        	newObj["ha"] = " "
	        } else {
	        	newObj["ha"] = "Home"
	        }
	        newObj["ttltdpg"] = (qbs[i].patd+qbs[i].rutd)/qbs[i].gp
	        newObj["patdpg"] = qbs[i].patd/qbs[i].gp
	        newObj["tdpct"] = qbs[i].patd/qbs[i].cmp
	        newObj["ttlydspg"] = (qbs[i].payds+qbs[i].ruyds)/qbs[i].gp
	        newObj["paydspg"] = qbs[i].payds/qbs[i].gp
	        newObj["ydspatt"] = qbs[i].payds/qbs[i].att
	        newObj["prate"] = (((((qbs[i].cmp/qbs[i].att)- 0.3)* 5) + (((qbs[i].payds/qbs[i].att)- 3)* .25) + ((qbs[i].patd/qbs[i].att)* 20) + (2.375 - ((qbs[i].int/qbs[i].att)* 25))) / 6)* 100
	        for (var j = 0; j < arr2.length;j++) {
	            if (qbs[i].team === arr2[j].team) {
                  newObj["day"] = moment(arr2[j].time.display).format('ddd')
	                newObj["line"] = arr2[j].line
	                newObj["teamTotal"] = (arr2[j].overunder/2)-(arr2[j].line/2)
	                newObj["gameTotal"] = arr2[j].overunder
	            }
	        }

	        for (var j = 0; j < arr3.length;j++) {
	            if (qbs[i].opp.substr(qbs[i].opp.length - 3) === arr3[j].abbr) {
                yardsCounter += arr3[j].fpts/arr3[j].gp
                var fanPassAg = yardsCounter/qbs.length // Console Log and enter the total of this variable below
                // console.log("avg: ", fanPassAg)
	            	newObj["paydsag"] = arr3[j].payds/arr3[j].att
	            	newObj["patdsag"] = arr3[j].patd/arr3[j].att
	                var x = arr3[j].fpts/arr3[j].gp
	                if ((17.05 - x) <= -2) {
	                	newObj["matchup"] = "A"
	                } else if ((17.05 - x) <= -1 && (17.05 - x) > -2) {
	                	newObj["matchup"] = "B"
	                } else if ((17.05 - x) < 1 && (17.05 - x) > -1)  {
	                	newObj["matchup"] = "C"
	                } else if ((17.05 - x) < 2 && (17.05 - x) >= 1)  {
	                	newObj["matchup"] = "D"
	                } else if ((17.05 - x) >= 2)  {
	                	newObj["matchup"] = "F"
	                }
	            }
	            if (qbs[i].opp === "N\/A") {
	            	newObj["matchup"] = " "
	            }
	        }
          for (var j = 0; j < dvoaResults.length;j++) {
             if (qbs[i].opp.substr(qbs[i].opp.length - 3) === dvoaResults[j].team) {
	                newObj["dvoa_pass_rank"] = dvoaResults[j].pass_rank
	            }
	        }
          for (var j = 0; j < proj.length;j++) {
             if (qbs[i].player === proj[j].name) {
	                newObj["proj"] = proj[j].proj
                  newObj["injury"] = proj[j].injury
                  newObj["own"] = proj[j].own
                  newObj["salary"] = proj[j].salary
                  newObj["hValue"] = this.hValue(proj[j].proj, proj[j].salary)
	            }
	        }
	        newArr.push(newObj)
	    }
    var newFilteredArr = this.filterQbBySalary(newArr)
		STORE.set({
			qbAnalyzer: newFilteredArr
		})
	},

	//Filter RB Data to only return players with a weekly DK salary
	filterRbBySalary: function(newArr) {
		function hasSalary(obj) {
			return obj !== null
		}
		function filterBySalary(item) {
      if (item.salary) {
		    return true;
		  }
		  	return false;
		}
		var rbArrBySalary = newArr.filter(filterBySalary);
		return rbArrBySalary
	},

	//Create RB Cheatsheet Object
	rbAnalyzer: function(rbs, arr2, arr3, proj) {
	    var newArr = []
      var yardsCounter = 0
      var dvoaResults = this.sortdvoa()
	    for (var i = 0; i < rbs.length; i++) {
	        var newObj = {}
	        newObj["id"] = rbs[i].id
	        newObj["player"] = rbs[i].player
	        newObj["team"] = this.getTeamName(rbs[i].team)
	        newObj["opp"] = rbs[i].opp
	        if (rbs[i].opp === "N\/A") {
	        	newObj["opp"] = "Bye Week"
	        } else {
	        	newObj["opp"] = rbs[i].opp
	        }
	        newObj["fppg"] = rbs[i].fpts/rbs[i].gp
	        if (newObj["opp"].charAt(0) === "@") {
	        	newObj["ha"] = "Away"
	        } else if (rbs[i].opp === "N\/A") {
	        	newObj["ha"] = " "
	        } else {
	        	newObj["ha"] = "Home"
	        }
	        newObj["ttltdpg"] = (rbs[i].patd+rbs[i].rutd)/rbs[i].gp
	        newObj["patdpg"] = rbs[i].patd/rbs[i].gp
	        newObj["ttltdpg"] = (rbs[i].rutd+rbs[i].retd)/rbs[i].gp
	        newObj["ttlydspg"] = (rbs[i].reyds+rbs[i].ruyds)/rbs[i].gp
	        newObj["recpg"] = rbs[i].rec/rbs[i].gp
          newObj["reyds"] = rbs[i].reyds/rbs[i].gp
	        newObj["paydspg"] = rbs[i].payds/rbs[i].gp
	        newObj["ydspatt"] = rbs[i].payds/rbs[i].att
	        newObj["touchMktShare"] = rbs[i].tchs/this.touchMarketShare(rbs[i].team)
          newObj["targetMktShare"] = rbs[i].tar/this.targetMarketShare(rbs[i].team)
	        for (var j = 0; j < arr2.length;j++) {
	            if (rbs[i].team === arr2[j].team) {
                  newObj["day"] = moment(arr2[j].time.display).format('ddd')
	                newObj["line"] = arr2[j].line
	                newObj["teamTotal"] = (arr2[j].overunder/2)-(arr2[j].line/2)
	                newObj["gameTotal"] = arr2[j].overunder
	            }
	        }
	        for (var j = 0; j < arr3.length;j++) {
	            if (rbs[i].opp.substr(rbs[i].opp.length - 3) === arr3[j].abbr) {
                  yardsCounter += arr3[j].fpts/arr3[j].gp
                  var fanRushAg = yardsCounter/rbs.length // Console Log and enter the total of this variable below
                  // console.log("avg: ", fanRushAg)
	                var x = arr3[j].fpts/arr3[j].gp
	                if ((21.27 - x) <= -2) {
	                	newObj["matchup"] = "A"
	                } else if ((21.27 - x) <= -1 && (21.27 - x) > -2) {
	                	newObj["matchup"] = "B"
	                } else if ((21.27 - x) < 1 && (21.27 - x) > -1)  {
	                	newObj["matchup"] = "C"
	                } else if ((21.27 - x) < 2 && (21.27 - x) >= 1)  {
	                	newObj["matchup"] = "D"
	                } else if ((21.27 - x) >= 2)  {
	                	newObj["matchup"] = "F"
	                }
	            }
	            if (rbs[i].opp === "N\/A") {
	            	newObj["matchup"] = " "
	            }
	        }
          for (var j = 0; j < dvoaResults.length;j++) {
             if (rbs[i].opp.substr(rbs[i].opp.length - 3) === dvoaResults[j].team) {
	                newObj["dvoa_rush_rank"] = dvoaResults[j].rush_rank
	            }
	        }
          for (var j = 0; j < proj.length;j++) {
             if (rbs[i].player === proj[j].name) {
	                newObj["proj"] = proj[j].proj
                  newObj["injury"] = proj[j].injury
                  newObj["own"] = proj[j].own
                  newObj["salary"] = proj[j].salary
                  newObj["hValue"] = this.hValue(proj[j].proj, proj[j].salary)
	            }
	        }
	        newArr.push(newObj)
	    }
    var newFilteredArr = this.filterQbBySalary(newArr)
		STORE.set({
			rbAnalyzer: newFilteredArr
		})
	},

	//Filter WR Data to only return players with a weekly DK salary
	filterWrBySalary: function(newArr) {
    function hasSalary(obj) {
			return obj !== null
		}
		function filterBySalary(item) {
      if (item.salary) {
		    return true;
		  }
		  	return false;
		}
		var wrArrBySalary = newArr.filter(filterBySalary);
		return wrArrBySalary
	},

	//Create WR Cheatsheet Object
	wrAnalyzer: function(wrs, arr2, arr3, proj) {
	    var newArr = []
      var yardsCounter = 0
      var dvoaResults = this.sortdvoa()
	    for (var i = 0; i < wrs.length; i++) {
	        var newObj = {}
	        newObj["id"] = wrs[i].id
	        newObj["player"] = wrs[i].player
	        newObj["team"] = this.getTeamName(wrs[i].team)
	        newObj["opp"] = wrs[i].opp
	        if (wrs[i].opp === "N\/A") {
	        	newObj["opp"] = "Bye Week"
	        } else {
	        	newObj["opp"] = wrs[i].opp
	        }
	        newObj["fppg"] = wrs[i].fpts/wrs[i].gp
	        if (newObj["opp"].charAt(0) === "@") {
	        	newObj["ha"] = "Away"
	        } else if (wrs[i].opp === "N\/A") {
	        	newObj["ha"] = " "
	        } else {
	        	newObj["ha"] = "Home"
	        }
	        newObj["ttltdpg"] = (wrs[i].patd+wrs[i].rutd)/wrs[i].gp
	        newObj["patdpg"] = wrs[i].patd/wrs[i].gp
	        newObj["ttltdpg"] = (wrs[i].rutd+wrs[i].retd)/wrs[i].gp
	        newObj["ttlydspg"] = (wrs[i].payds+wrs[i].ruyds)/wrs[i].gp
          newObj["tarpg"] = wrs[i].tar/wrs[i].gp
          newObj["targetMktShare"] = wrs[i].tar/this.targetMarketShare(wrs[i].team)
	        newObj["recpg"] = wrs[i].rec/wrs[i].gp
          newObj["recydspg"] = wrs[i].reyds/wrs[i].gp
          newObj["retdpg"] = wrs[i].retd/wrs[i].gp
          newObj["rztarpg"] = wrs[i].rztar/wrs[i].gp
	        newObj["paydspg"] = wrs[i].payds/wrs[i].gp
	        newObj["ydspatt"] = wrs[i].payds/wrs[i].att
	        for (var j = 0; j < arr2.length;j++) {
	            if (wrs[i].team === arr2[j].team) {
                  newObj["day"] = moment(arr2[j].time.display).format('ddd')
	                newObj["line"] = arr2[j].line
	                newObj["teamTotal"] = (arr2[j].overunder/2)-(arr2[j].line/2)
	                newObj["gameTotal"] = arr2[j].overunder
	            }
	        }
	        for (var j = 0; j < arr3.length;j++) {
	            if (wrs[i].opp.substr(wrs[i].opp.length - 3) === arr3[j].abbr) {
                  yardsCounter += arr3[j].fpts/arr3[j].gp
                  var fanRecAg = yardsCounter/wrs.length // Console Log and enter the total of this variable below
                  // console.log("fanRecAg", fanRecAg);
	                var x = arr3[j].fpts/arr3[j].gp
	                if ((35.04 - x) <= -2) {
	                	newObj["matchup"] = "A"
	                } else if ((35.04 - x) <= -1 && (35.04 - x) > -2) {
	                	newObj["matchup"] = "B"
	                } else if ((35.04 - x) < 1 && (35.04 - x) > -1)  {
	                	newObj["matchup"] = "C"
	                } else if ((35.04 - x) < 2 && (35.04 - x) >= 1)  {
	                	newObj["matchup"] = "D"
	                } else if ((35.04 - x) >= 2)  {
	                	newObj["matchup"] = "F"
	                }
	            }
	            if (wrs[i].opp === "N\/A") {
	            	newObj["matchup"] = " "
	            }
	        }
          for (var j = 0; j < dvoaResults.length;j++) {
             if (wrs[i].opp.substr(wrs[i].opp.length - 3) === dvoaResults[j].team) {
	                newObj["dvoa_pass_rank"] = dvoaResults[j].pass_rank
	            }
	        }
          for (var j = 0; j < proj.length;j++) {
             if (wrs[i].player === proj[j].name) {
	                newObj["proj"] = proj[j].proj
                  newObj["injury"] = proj[j].injury
                  newObj["own"] = proj[j].own
                  newObj["salary"] = proj[j].salary
                  newObj["hValue"] = this.hValue(proj[j].proj, proj[j].salary)
	            }
	        }
          newArr.push(newObj)
	    }
    var newFilteredArr = this.filterWrBySalary(newArr)
		STORE.set({
			wrAnalyzer: newFilteredArr
		})
	},

	//Filter TE Data to only return players with a weekly DK salary
	filterTeBySalary: function(newArr) {
    function hasSalary(obj) {
			return obj !== null
		}
		function filterBySalary(item) {
      if (item.salary) {
		    return true;
		  }
		  	return false;
		}
		var teArrBySalary = newArr.filter(filterBySalary);
		return teArrBySalary
	},

	//Create TE Cheatsheet Object
	teAnalyzer: function(tes, arr2, arr3, proj) {
	    var newArr = []
      var yardsCounter = 0
      var dvoaResults = this.sortdvoa()
	    for (var i = 0; i < tes.length; i++) {
	        var newObj = {}
	        newObj["id"] = tes[i].id
	        newObj["player"] = tes[i].player
	        newObj["team"] = this.getTeamName(tes[i].team)
	        newObj["opp"] = tes[i].opp
	        if (tes[i].opp === "N\/A") {
	        	newObj["opp"] = "Bye Week"
	        } else {
	        	newObj["opp"] = tes[i].opp
	        }
	        newObj["fppg"] = tes[i].fpts/tes[i].gp
	        if (newObj["opp"].charAt(0) === "@") {
	        	newObj["ha"] = "Away"
	        } else if (tes[i].opp === "N\/A") {
	        	newObj["ha"] = " "
	        } else {
	        	newObj["ha"] = "Home"
	        }
	        newObj["ttltdpg"] = (tes[i].patd+tes[i].rutd)/tes[i].gp
	        newObj["patdpg"] = tes[i].patd/tes[i].gp
	        newObj["ttltdpg"] = (tes[i].rutd+tes[i].retd)/tes[i].gp
	        newObj["ttlydspg"] = (tes[i].payds+tes[i].ruyds)/tes[i].gp
          newObj["tarpg"] = tes[i].tar/tes[i].gp
	        newObj["recpg"] = tes[i].rec/tes[i].gp
          newObj["recydspg"] = tes[i].reyds/tes[i].gp
          newObj["retdpg"] = tes[i].retd/tes[i].gp
          newObj["rztarpg"] = tes[i].rztar/tes[i].gp
          newObj["rztargetMktShare"] = tes[i].rztar/this.rzTargetMarketShare(tes[i].team)
	        newObj["paydspg"] = tes[i].payds/tes[i].gp
	        newObj["ydspatt"] = tes[i].payds/tes[i].att
	        for (var j = 0; j < arr2.length;j++) {
	            if (tes[i].team === arr2[j].team) {
                  newObj["day"] = moment(arr2[j].time.display).format('ddd')
	                newObj["line"] = arr2[j].line
	                newObj["teamTotal"] = (arr2[j].overunder/2)-(arr2[j].line/2)
	                newObj["gameTotal"] = arr2[j].overunder
	            }
	        }
	        for (var j = 0; j < arr3.length;j++) {
	            if (tes[i].opp.substr(tes[i].opp.length - 3) === arr3[j].abbr) {
                  yardsCounter += arr3[j].fpts/arr3[j].gp
                  var fanTeAg = yardsCounter/tes.length // Console Log and enter the total of this variable below
                  // console.log("fanTeAg", fanTeAg);
	                var x = arr3[j].fpts/arr3[j].gp
	                if ((12.21 - x) <= -2) {
	                	newObj["matchup"] = "A"
	                } else if ((12.21 - x) <= -1 && (12.21 - x) > -2) {
	                	newObj["matchup"] = "B"
	                } else if ((12.21 - x) < 1 && (12.21 - x) > -1)  {
	                	newObj["matchup"] = "C"
	                } else if ((12.21 - x) < 2 && (12.21 - x) >= 1)  {
	                	newObj["matchup"] = "D"
	                } else if ((12.21 - x) >= 2)  {
	                	newObj["matchup"] = "F"
	                }
	            }
	            if (tes[i].opp === "N\/A") {
	            	newObj["matchup"] = " "
	            }
	        }
          for (var j = 0; j < dvoaResults.length;j++) {
             if (tes[i].opp.substr(tes[i].opp.length - 3) === dvoaResults[j].team) {
                  newObj["dvoa_pass_rank"] = dvoaResults[j].pass_rank
              }
          }
          for (var j = 0; j < proj.length;j++) {
             if (tes[i].player === proj[j].name && tes[i].pos === proj[j].position) {
	                newObj["proj"] = proj[j].proj
                  newObj["injury"] = proj[j].injury
                  newObj["own"] = proj[j].own
                  newObj["salary"] = proj[j].salary
                  newObj["hValue"] = this.hValue(proj[j].proj, proj[j].salary)
	            }
	        }
          newArr.push(newObj)
	    }
    var newFilteredArr = this.filterTeBySalary(newArr)
		STORE.set({
			teAnalyzer: newFilteredArr
		})
	},

	//Filter DF Data to only return players with a weekly DK salary
	filterDfBySalary: function(newArr) {
    function hasSalary(obj) {
			return obj !== null
		}
		function filterBySalary(item) {
      if (item.salary) {
		    return true;
		  }
		  	return false;
		}
		var dfArrBySalary = newArr.filter(filterBySalary);
		return dfArrBySalary
	},

	dfAnalyzer: function(df, arr2, proj) {
	    var newArr = []
      var dvoaResults = this.sortdvoa()
	    for (var i = 0; i < df.length; i++) {
	        var newObj = {}
	        newObj["id"] = df[i].id
	        newObj["player"] = df[i].player
	        newObj["team"] = df[i].team
	        newObj["opp"] = df[i].opp
	        if (df[i].opp === "N\/A") {
	        	newObj["opp"] = "Bye Week"
	        } else {
	        	newObj["opp"] = df[i].opp
	        }
	        newObj["fppg"] = df[i].fpts/df[i].gp
	        if (newObj["opp"].charAt(0) === "@") {
	        	newObj["ha"] = "Away"
	        } else if (df[i].opp === "N\/A") {
	        	newObj["ha"] = " "
	        } else {
	        	newObj["ha"] = "Home"
	        }
	        newObj["ttltdpg"] = (df[i].patd+df[i].rutd)/df[i].gp
	        newObj["patdpg"] = df[i].patd/df[i].gp
	        newObj["ttltdpg"] = (df[i].rutd+df[i].retd)/df[i].gp
	        newObj["ttlydspg"] = (df[i].payds+df[i].ruyds)/df[i].gp
	        newObj["recpg"] = df[i].rec/df[i].gp
	        newObj["paydspg"] = df[i].payds/df[i].gp
	        newObj["ydspatt"] = df[i].payds/df[i].att
	        for (var j = 0; j < arr2.length;j++) {
	            if (df[i].team === arr2[j].team) {
                  newObj["day"] = moment(arr2[j].time.display).format('ddd')
	                newObj["line"] = arr2[j].line
	                newObj["teamTotal"] = (arr2[j].overunder/2)-(arr2[j].line/2)
	                newObj["gameTotal"] = arr2[j].overunder
	            }
	        }
          for (var j = 0; j < proj.length;j++) {
             if (df[i].player === proj[j].name) {
	                newObj["proj"] = proj[j].proj
                  newObj["injury"] = proj[j].injury
                  newObj["own"] = proj[j].own
                  newObj["salary"] = proj[j].salary
                  newObj["hValue"] = this.hValue(proj[j].proj, proj[j].salary)
	            }
	        }
          newObj["deftd"] = df[i].deftd
          newObj["int"] = df[i].int
          newObj["fumr"] = df[i].fumr
          newObj["sack"] = df[i].sack
          newObj["rettd"] = df[i].rettd
	        newArr.push(newObj)
	    }
      var newFilteredArr = this.filterDfBySalary(newArr)
  		STORE.set({
  			dfAnalyzer: newFilteredArr
  		})
  	},

	//============================================//
	//----------- MARKETSHARE ALG ----------------//
	//============================================//

	// Calculate Touch Marketshare for RBs on the same team
	touchMarketShare: function(team) {
		var touches = 0
		for (var i = 0; i < seasonRBData.length; i++) {
			if (seasonRBData[i].team === team) {
				touches += seasonRBData[i].tchs
			}
		}
    for (var i = 0; i < seasonWRData.length; i++) {
			if (seasonWRData[i].team === team) {
				touches += seasonWRData[i].tchs
			}
		}
    for (var i = 0; i < seasonTEData.length; i++) {
			if (seasonTEData[i].team === team) {
				touches += seasonTEData[i].tchs
			}
		}
		return touches
	},

  targetMarketShare: function(team) {
		var targets = 0
		for (var i = 0; i < seasonRBData.length; i++) {
			if (seasonRBData[i].team === team) {
				targets += seasonRBData[i].tar
			}
		}
    for (var i = 0; i < seasonWRData.length; i++) {
			if (seasonWRData[i].team === team) {
				targets += seasonWRData[i].tar
			}
		}
    for (var i = 0; i < seasonTEData.length; i++) {
			if (seasonTEData[i].team === team) {
				targets += seasonTEData[i].tar
			}
		}
		return targets
	},

  rzTargetMarketShare: function(team) {
    var rzTargets = 0
    for (var i = 0; i < seasonRBData.length; i++) {
      if (seasonRBData[i].team === team) {
        rzTargets += seasonRBData[i].rztar
      }
    }
    for (var i = 0; i < seasonWRData.length; i++) {
      if (seasonWRData[i].team === team) {
        rzTargets += seasonWRData[i].rztar
      }
    }
    for (var i = 0; i < seasonTEData.length; i++) {
      if (seasonTEData[i].team === team) {
        rzTargets += seasonTEData[i].rztar
      }
    }
    return rzTargets
  },

  //============================================//
	//------------------ H-VALUE -----------------//
	//============================================//
  hValue: function(proj, salary) {
    let sal = salary.substring(1, salary.length)
    let sala = parseFloat(sal.replace(/,/g, ''))
    let result
    if(sala !== null){
      result = (Math.pow(proj, Math.sqrt(3)) / sala) * 2000
    }
    return result
  },


	//============================================//
	//------------- VEGAS ACTIONS ----------------//
	//============================================//

	// Calculate team total from vegas game totals
	calcTeamTotal: function(total, line) {
		var result = (total/2)-(line/2)
		return result
	},

  //============================================//
  //------------- QUICK PICK ALGS --------------//
  //============================================//
  qbPicks: function(qb) {
    var qbPicksArr = []
    for (var i = 0; i < qb.length; i++) {
      var line = parseInt(qb[i].line)
      var currency = qb[i].salary
      var slate = qb[i].day
      var tdPercent = qb[i].tdpct
      var injury = qb[i].injury
      var salary = Number(currency.replace(/[^0-9\.-]+/g,""));
      var proj = parseInt(qb[i].proj)
      if (qb[i].teamTotal >= 26 && line <= 0 && slate !== 'Thu' && slate !== 'Mon' && injury !== 'PUP' && injury !== 'SSPD') {
        // && qb[i].ha === 'Home' && salary > 5000 && salary < 8000
        qbPicksArr.push(qb[i])
      }
    }
    return qbPicksArr
  },

  rbPicks: function(rb) {
    var rbPicksArr = []
    for (var i = 0; i < rb.length; i++) {
      var line = parseInt(rb[i].line)
      var currency = rb[i].salary
      var slate = rb[i].day
      var injury = rb[i].injury
      var salary = Number(currency.replace(/[^0-9\.-]+/g,""));
      var proj = parseInt(rb[i].proj)
      if (line <= -3 && slate !== 'Thu' && slate !== 'Mon' && injury !== 'PUP' && injury !== 'SSPD' && proj >= 8 && rb[i].ha === 'Home') {
        // rb[i].teamTotal >= 24 && rb[i].ha === 'Home' && line < 0 && salary > 5000 && salary < 12000 && proj >= 10
        rbPicksArr.push(rb[i])
      }
    }
    return rbPicksArr
  },

  wrPicks: function(wr) {
    var wrPicksArr = []
    for (var i = 0; i < wr.length; i++) {
      var line = parseInt(wr[i].line)
      var salary = parseInt(wr[i].salary)
      if (wr[i].teamTotal >= 24 && wr[i].ha === 'Home' && line < 0 && salary > 6000 && salary < 8000) {
        wrPicksArr.push(wr[i])
      }
    }
    return wrPicksArr
  },

  tePicks: function(te) {
    var tePicksArr = []
    for (var i = 0; i < te.length; i++) {
      var line = parseInt(te[i].line)
      var salary = parseInt(te[i].salary)
      if (te[i].teamTotal >= 24 && te[i].ha === 'Home' && line < 0 && salary > 5000 && salary < 8000) {
        tePicksArr.push(te[i])
      }
    }
    return tePicksArr
  },

  dfPicks: function(df) {
    var dfPicksArr = []
    for (var i = 0; i < df.length; i++) {
      var line = parseInt(df[i].line)
      var salary = parseInt(df[i].salary)
      if (df[i].teamTotal >= 24 && df[i].ha === 'Home' && line < 0 && salary > 5000 && salary < 8000) {
        dfPicksArr.push(df[i])
      }
    }
    return dfPicksArr
  },

  //============================================//
  //-------------- PLANNER DATA ----------------//
  //============================================//
  calcBankroll: function(bankroll) {
    var dollar = Number(bankroll)
    if (isNaN(dollar)) {
      STORE.set({
        plannerError: true,
  			error: "Input must be a number!"
  		})
      return
    }
    let tenPercent = dollar*0.10
    let twentyPercent = dollar*0.20
    let thirtyPercent = dollar*0.30
    let plannerObj = {}
    plannerObj.bankroll = (dollar).toFixed(2)
    plannerObj.tenPercent = (tenPercent).toFixed(2)
    plannerObj.twentyPercent = (twentyPercent).toFixed(2)
    plannerObj.thirtyPercent = (thirtyPercent).toFixed(2)
    plannerObj.casualTwentyPerc = (tenPercent*0.20).toFixed(2)
    plannerObj.casualEightyPerc = (tenPercent*0.80).toFixed(2)
    plannerObj.modThirtyPerc = (tenPercent*0.30).toFixed(2)
    plannerObj.modSeventyPerc = (tenPercent*0.70).toFixed(2)
    plannerObj.aggFortyPerc = (tenPercent*0.40).toFixed(2)
    plannerObj.aggSixtyPerc = (tenPercent*0.60).toFixed(2)
    STORE.set({
      plannerError: false,
			bankroll: plannerObj
		})

  },

	//============================================//
	//-------------- MISC ACTIONS ----------------//
	//============================================//

  //Return only the first 32 results of dvoa results
  sortdvoa: function() {
    var dvoaArr = []
    for (var i = 0; i < 36; i++) {
      this.alterDvoaTeamName(dvoa[i])
      dvoaArr.push(dvoa[i]);
    }
    return dvoaArr
  },

  // Change dvoa team abbreviations to match rotogrinders
  alterDvoaTeamName: function(abb) {
    if (abb.team === "KC") {
			abb.team = "KCC"
		}
    if (abb.team === "NE") {
			abb.team = "NEP"
		}
    if (abb.team === "TB") {
      abb.team = "TBB"
    }
    if (abb.team === "NO") {
      abb.team = "NOS"
    }
    if (abb.team === "SF") {
      abb.team = "SFO"
    }
    if (abb.team === "LARM") {
      abb.team = "LAR"
    }
    if (abb.team === "GB") {
      abb.team = "GBP"
    }
    if (abb.team === "SD") {
      abb.team = "LAC"
    }
  },

	// Change abbreviated team names to full team names
	getTeamName: function(team) {
		if (team === "PIT") {
			return "Pittsburgh Steelers"
		}
		if (team === "NEP") {
			return "New England Patriots"
		}
		if (team === "KCC") {
			return "Kansas City Chiefs"
		}
		if (team === "BUF") {
			return "Buffalo Bills"
		}
		if (team === "ATL") {
			return "Atlanta Falcons"
		}
		if (team === "PHI") {
			return "Philadelphia Eagles"
		}
		if (team === "ARI") {
			return "Arizona Cardinals"
		}
		if (team === "OAK") {
			return "Oakland Raiders"
		}
		if (team === "TBB") {
			return "Tampa Bay Buccaneers"
		}
		if (team === "BAL") {
			return "Baltimore Ravens"
		}
		if (team === "CLE") {
			return "Cleveland Browns"
		}
		if (team === "CIN") {
			return "Cincinnati Bengals"
		}
		if (team === "MIA") {
			return "Miami Dolphins"
		}
		if (team === "TEN") {
			return "Tennessee Titans"
		}
		if (team === "DET") {
			return "Detroit Lions"
		}
		if (team === "WAS") {
			return "Washington Redskins"
		}
		if (team === "NYJ") {
			return "New York Jets"
		}
		if (team === "JAC") {
			return "Jacksonville Jaguars"
		}
		if (team === "CHI") {
			return "Chicago Bears"
		}
		if (team === "HOU") {
			return "Houston Texans"
		}
		if (team === "LAR") {
			return "Los Angeles Rams"
		}
		if (team === "IND") {
			return "Indianapolis Colts"
		}
		if (team === "CAR") {
			return "Carolina Panthers"
		}
		if (team === "SEA") {
			return "Seattle Seahawks"
		}
		if (team === "GBP") {
			return "Green Bay Packers"
		}
		if (team === "SFO") {
			return "San Francisco 49ers"
		}
		if (team === "NYG") {
			return "New York Giants"
		}
		if (team === "DAL") {
			return "Dallas Cowboys"
		}
		if (team === "NOS") {
			return "New Orleans Saints"
		}
		if (team === "MIN") {
			return "Minnesota Vikings"
		}
		if (team === "LAC") {
			return "Los Angeles Chargers"
		}
		if (team === "DEN") {
			return "Denver Broncos"
		}
	},

	// =============================== //
	// ----- USER AUTHENTICATION ----- //
	// =============================== //

	// Register User Account
	registerUser: function(userData) {
		User.register(userData)
			.done(
				function(response) {
					console.log(`New user ${response.firstName} registered!`)
					console.log(response)
					ACTIONS.loginUser(userData.email, userData.password)
				}
			)
			.fail(
				function(error) {
					alert('Problem registering user!')
					console.log(error)
				}
			)
	},

	// Login User
	loginUser: function(email,password) {
		User.login(email,password)
			.done(
				function(response) {
					console.log(`${response.firstName} logged in!`)
					console.log(response)
					location.hash = 'home'
				}
			)
			.fail(
				function(error) {
					alert('Problem logging in!')
					console.log(error)
				}
			)
	},

	// Logout User
	logout: function(){
		User.logout()
		.done(
			function(response){
				console.log('Logged out')
				location.hash = 'landing'
			}
		)
		.fail(
			function(err){
				console.log('Problem logging out')
				console.log(err)
			}
		)
	},

	// Find login name
	loginName: function(){
		if (User.getCurrentUser() === null){
			return 'Welcome!'
		}
		else if (User.getCurrentUser().get('firstName') === undefined) {
			return 'Welcome!'
		}
		return `Welcome, ${User.getCurrentUser().get('firstName')}!`
	},

	// =============================== //
	// ----- Stat Button Actions ----- //
	// =============================== //
	showAllStats: function() {
		STORE.set({
			showAllStats: true,
			showQBStats: false,
			showRBStats: false,
			showWRStats: false,
			showTEStats: false,
			showDFStats: false,
			allButtonColor: '#336D9F',
			qbButtonColor: '',
			rbButtonColor: '',
			wrButtonColor: '',
			teButtonColor: '',
			dfButtonColor: '',
			allButtonFontColor: '#FFF',
			qbButtonFontColor: '',
			rbButtonFontColor: '',
			wrButtonFontColor: '',
			teButtonFontColor: '',
			dfButtonFontColor: ''
		})
	},

	showQBStats: function() {
		STORE.set({
			showAllStats: false,
			showQBStats: true,
			showRBStats: false,
			showWRStats: false,
			showTEStats: false,
			showDFStats: false,
			allButtonColor: '',
			qbButtonColor: '#336D9F',
			rbButtonColor: '',
			wrButtonColor: '',
			teButtonColor: '',
			dfButtonColor: '',
			allButtonFontColor: '',
			qbButtonFontColor: '#FFF',
			rbButtonFontColor: '',
			wrButtonFontColor: '',
			teButtonFontColor: '',
			dfButtonFontColor: ''
		})
	},

	showRBStats: function() {
		STORE.set({
			showAllStats: false,
			showQBStats: false,
			showRBStats: true,
			showWRStats: false,
			showTEStats: false,
			showDFStats: false,
			allButtonColor: '',
			qbButtonColor: '',
			rbButtonColor: '#336D9F',
			wrButtonColor: '',
			teButtonColor: '',
			dfButtonColor: '',
			allButtonFontColor: '',
			qbButtonFontColor: '',
			rbButtonFontColor: '#FFF',
			wrButtonFontColor: '',
			teButtonFontColor: '',
			dfButtonFontColor: ''
		})
	},

	showWRStats: function() {
		STORE.set({
			showAllStats: false,
			showQBStats: false,
			showRBStats: false,
			showWRStats: true,
			showTEStats: false,
			showDFStats: false,
			allButtonColor: '',
			qbButtonColor: '',
			rbButtonColor: '',
			wrButtonColor: '#336D9F',
			teButtonColor: '',
			dfButtonColor: '',
			allButtonFontColor: '',
			qbButtonFontColor: '',
			rbButtonFontColor: '',
			wrButtonFontColor: '#FFF',
			teButtonFontColor: '',
			dfButtonFontColor: ''
		})
	},

	showTEStats: function() {
		STORE.set({
			showAllStats: false,
			showQBStats: false,
			showRBStats: false,
			showWRStats: false,
			showTEStats: true,
			showDFStats: false,
			allButtonColor: '',
			qbButtonColor: '',
			rbButtonColor: '',
			wrButtonColor: '',
			teButtonColor: '#336D9F',
			dfButtonColor: '',
			allButtonFontColor: '',
			qbButtonFontColor: '',
			rbButtonFontColor: '',
			wrButtonFontColor: '',
			teButtonFontColor: '#FFF',
			dfButtonFontColor: ''
		})
	},

	showDFStats: function() {
		STORE.set({
			showAllStats: false,
			showQBStats: false,
			showRBStats: false,
			showWRStats: false,
			showTEStats: false,
			showDFStats: true,
			allButtonColor: '',
			qbButtonColor: '',
			rbButtonColor: '',
			wrButtonColor: '',
			teButtonColor: '',
			dfButtonColor: '#336D9F',
			allButtonFontColor: '',
			qbButtonFontColor: '',
			rbButtonFontColor: '',
			wrButtonFontColor: '',
			teButtonFontColor: '',
			dfButtonFontColor: '#FFF'
		})
	},

	showTotalStats: function() {
		STORE.set({
			showCurrentSeasonPPG: false,
			showLastSeasonPPG: false,
			ppgButtonColor: '',
			ttlButtonColor: '#336D9F',
			ppgButtonFontColor: '',
			ttlButtonFontColor: '#FFF'
		})
	},

	showPPGStats: function() {
		STORE.set({
			showCurrentSeasonPPG: true,
			showLastSeasonPPG: true,
			ttlButtonColor: '',
			ppgButtonColor: '#336D9F',
			ppgButtonFontColor: '#FFF',
			ttlButtonFontColor: ''
		})
	},

	showCurrentSeasonStats: function() {
		STORE.set({
			showCurrentSeason: true,
			showCurrentSeasonPPG: true,
			ttlButtonColor: '',
			ppgButtonColor: '#336D9F',
			lsButtonColor: '',
			csButtonColor: '#336D9F',
			ttlButtonFontColor: '',
			ppgButtonFontColor: '#FFF',
			lsButtonFontColor: '',
			csButtonFontColor: '#FFF'
		})
	},

	showLastSeasonStats: function() {
		STORE.set({
			showCurrentSeason: false,
			showLastSeasonPPG: true,
			ttlButtonColor: '',
			ppgButtonColor: '#336D9F',
			lsButtonColor: '#336D9F',
			csButtonColor: '',
			ttlButtonFontColor: '',
			ppgButtonFontColor: '#FFF',
			lsButtonFontColor: '#FFF',
			csButtonFontColor: ''
		})
	},

	// ==================================== //
	// ----- Defensive Button Actions ----- //
	// ==================================== //
	showQBDefense: function() {
		STORE.set({
			showQBDef: true,
			showRBDef: false,
			showWRDef: false,
			showTEDef: false,
			qbDefButtonColor: '#336D9F',
			rbDefButtonColor: '',
			wrDefButtonColor: '',
			teDefButtonColor: '',
			qbDefButtonFontColor: '#FFF',
			rbDefButtonFontColor: '',
			wrDefButtonFontColor: '',
			teDefButtonFontColor: ''
		})
	},

	showRBDefense: function() {
		STORE.set({
			showQBDef: false,
			showRBDef: true,
			showWRDef: false,
			showTEDef: false,
			qbDefButtonColor: '',
			rbDefButtonColor: '#336D9F',
			wrDefButtonColor: '',
			teDefButtonColor: '',
			qbDefButtonFontColor: '',
			rbDefButtonFontColor: '#FFF',
			wrDefButtonFontColor: '',
			teDefButtonFontColor: ''
		})
	},

	showWRDefense: function() {
		STORE.set({
			showQBDef: false,
			showRBDef: false,
			showWRDef: true,
			showTEDef: false,
			qbDefButtonColor: '',
			rbDefButtonColor: '',
			wrDefButtonColor: '#336D9F',
			teDefButtonColor: '',
			qbDefButtonFontColor: '',
			rbDefButtonFontColor: '',
			wrDefButtonFontColor: '#FFF',
			teDefButtonFontColor: ''
		})
	},

	showTEDefense: function() {
		STORE.set({
			showQBDef: false,
			showRBDef: false,
			showWRDef: false,
			showTEDef: true,
			qbDefButtonColor: '',
			rbDefButtonColor: '',
			wrDefButtonColor: '',
			teDefButtonColor: '#336D9F',
			qbDefButtonFontColor: '',
			rbDefButtonFontColor: '',
			wrDefButtonFontColor: '',
			teDefButtonFontColor: '#FFF'
		})
	},

	showTotalDefense: function() {
		STORE.set({
			showCurrentDefensePPG: false,
			showLastDefensePPG: false,
			ppgDefButtonColor: '',
			ttlDefButtonColor: '#336D9F',
			ppgDefButtonFontColor: '',
			ttlDefButtonFontColor: '#FFF'
		})
	},

	showPPGDefense: function() {
		STORE.set({
			showCurrentDefensePPG: true,
			showLastDefensePPG: true,
			ttlDefButtonColor: '',
			ppgDefButtonColor: '#336D9F',
			ttlDefButtonFontColor: '',
			ppgDefButtonFontColor: '#FFF'
		})
	},

	showCurrentSeasonDefense: function() {
		STORE.set({
			showCurrentDefense: true,
			showCurrentDefensePPG: true,
			ttlDefButtonColor: '',
			ppgDefButtonColor: '#336D9F',
			lsDefButtonColor: '',
			csDefButtonColor: '#336D9F',
			ttlDefButtonFontColor: '',
			ppgDefButtonFontColor: '#FFF',
			lsDefButtonFontColor: '',
			csDefButtonFontColor: '#FFF'
		})
	},

	showLastSeasonDefense: function() {
		STORE.set({
			showCurrentDefense: false,
			showLastDefensePPG: true,
			ttlDefButtonColor: '',
			ppgDefButtonColor: '#336D9F',
			lsDefButtonColor: '#336D9F',
			csDefButtonColor: '',
			ttlDefButtonFontColor: '',
			ppgDefButtonFontColor: '#FFF',
			lsDefButtonFontColor: '#FFF',
			csDefButtonFontColor: ''
		})
	},

	// ===================================== //
	// ----- CheatSheet Button Actions ----- //
	// ===================================== //
	showQBCheat: function() {
		STORE.set({
			showQBCheat: true,
			showRBCheat: false,
			showWRCheat: false,
			showTECheat: false,
			showDFCheat: false,
			qbCheatButtonColor: '#336D9F',
			rbCheatButtonColor: '',
			wrCheatButtonColor: '',
			teCheatButtonColor: '',
			dfCheatButtonColor: '',
			qbCheatButtonFontColor: '#FFF',
			rbCheatButtonFontColor: '',
			wrCheatButtonFontColor: '',
			teCheatButtonFontColor: '',
			dfCheatButtonFontColor: ''
		})
	},

	showRBCheat: function() {
		STORE.set({
			showQBCheat: false,
			showRBCheat: true,
			showWRCheat: false,
			showTECheat: false,
			showDFCheat: false,
			qbCheatButtonColor: '',
			rbCheatButtonColor: '#336D9F',
			wrCheatButtonColor: '',
			teCheatButtonColor: '',
			dfCheatButtonColor: '',
			qbCheatButtonFontColor: '',
			rbCheatButtonFontColor: '#FFF',
			wrCheatButtonFontColor: '',
			teCheatButtonFontColor: '',
			dfCheatButtonFontColor: ''
		})
	},

	showWRCheat: function() {
		STORE.set({
			showQBCheat: false,
			showRBCheat: false,
			showWRCheat: true,
			showTECheat: false,
			showDFCheat: false,
			qbCheatButtonColor: '',
			rbCheatButtonColor: '',
			wrCheatButtonColor: '#336D9F',
			teCheatButtonColor: '',
			dfCheatButtonColor: '',
			qbCheatButtonFontColor: '',
			rbCheatButtonFontColor: '',
			wrCheatButtonFontColor: '#FFF',
			teCheatButtonFontColor: '',
			dfCheatButtonFontColor: ''
		})
	},

	showTECheat: function() {
		STORE.set({
			showQBCheat: false,
			showRBCheat: false,
			showWRCheat: false,
			showTECheat: true,
			showDFCheat: false,
			qbCheatButtonColor: '',
			rbCheatButtonColor: '',
			wrCheatButtonColor: '',
			teCheatButtonColor: '#336D9F',
			dfCheatButtonColor: '',
			qbCheatButtonFontColor: '',
			rbCheatButtonFontColor: '',
			wrCheatButtonFontColor: '',
			teCheatButtonFontColor: '#FFF',
			dfCheatButtonFontColor: ''
		})
	},

	showDFCheat: function() {
		STORE.set({
			showQBCheat: false,
			showRBCheat: false,
			showWRCheat: false,
			showTECheat: false,
			showDFCheat: true,
			qbCheatButtonColor: '',
			rbCheatButtonColor: '',
			wrCheatButtonColor: '',
			teCheatButtonColor: '',
			dfCheatButtonColor: '#336D9F',
			qbCheatButtonFontColor: '',
			rbCheatButtonFontColor: '',
			wrCheatButtonFontColor: '',
			teCheatButtonFontColor: '',
			dfCheatButtonFontColor: '#FFF'
		})
	},

  // ===================================== //
	// ------------ PICKS ACTIONS ---------- //
	// ===================================== //
	showQBPicks: function() {
		STORE.set({
			showQBPicks: true,
			showRBPicks: false,
			showWRPicks: false,
			showTEPicks: false,
			showDFPicks: false,
      qbPicksButtonColor: '#336D9F',
			rbPicksButtonColor: '',
			wrPicksButtonColor: '',
			tePicksButtonColor: '',
			dfPicksButtonColor: '',
			qbPicksButtonFontColor: '#FFF',
			rbPicksButtonFontColor: '',
			wrPicksButtonFontColor: '',
			tePicksButtonFontColor: '',
			dfPicksButtonFontColor: ''
		})
	},

	showRBPicks: function() {
		STORE.set({
			showQBPicks: false,
			showRBPicks: true,
			showWRPicks: false,
			showTEPicks: false,
			showDFPicks: false,
      qbPicksButtonColor: '',
			rbPicksButtonColor: '#336D9F',
			wrPicksButtonColor: '',
			tePicksButtonColor: '',
			dfPicksButtonColor: '',
			qbPicksButtonFontColor: '',
			rbPicksButtonFontColor: '#FFF',
			wrPicksButtonFontColor: '',
			tePicksButtonFontColor: '',
			dfPicksButtonFontColor: ''
		})
	},

	showWRPicks: function() {
		STORE.set({
			showQBPicks: false,
			showRBPicks: false,
			showWRPicks: true,
			showTEPicks: false,
			showDFPicks: false,
      qbPicksButtonColor: '',
			rbPicksButtonColor: '',
			wrPicksButtonColor: '#336D9F',
			tePicksButtonColor: '',
			dfPicksButtonColor: '',
			qbPicksButtonFontColor: '',
			rbPicksButtonFontColor: '',
			wrPicksButtonFontColor: '#FFF',
			tePicksButtonFontColor: '',
			dfPicksButtonFontColor: ''

		})
	},

	showTEPicks: function() {
		STORE.set({
			showQBPicks: false,
			showRBPicks: false,
			showWRPicks: false,
			showTEPicks: true,
			showDFPicks: false,
      qbPicksButtonColor: '',
			rbPicksButtonColor: '',
			wrPicksButtonColor: '',
			tePicksButtonColor: '#336D9F',
			dfPicksButtonColor: '',
			qbPicksButtonFontColor: '',
			rbPicksButtonFontColor: '',
			wrPicksButtonFontColor: '',
			tePicksButtonFontColor: '#FFF',
			dfPicksButtonFontColor: ''
		})
	},

	showDFPicks: function() {
		STORE.set({
			showQBPicks: false,
			showRBPicks: false,
			showWRPicks: false,
			showTEPicks: false,
			showDFPicks: true,
      qbPicksButtonColor: '',
			rbPicksButtonColor: '',
			wrPicksButtonColor: '',
			tePicksButtonColor: '',
			dfPicksButtonColor: '#336D9F',
			qbPicksButtonFontColor: '',
			rbPicksButtonFontColor: '',
			wrPicksButtonFontColor: '',
			tePicksButtonFontColor: '',
			dfPicksButtonFontColor: '#FFF'
		})
	},

	// ============================== //
	// -- Bankroll Tracker Actions -- //
	// ============================== //

	// Fetching contest data for bankroll tracker
	fetchAllData: function() {
		var contestColl = STORE.get('contestCollection')
		contestColl.fetch()
			.then(function(){
				STORE.set({
					contestCollection: contestColl,
					loadingGif: false,
				})
			})
	},

	// Saving contests to database for Bankroll Tracker
	saveData: function(resultsObj) {
		var contests = resultsObj.data
		contests.forEach(function(i) {
			var newContest = new Contest(i)
			newContest.save()
				.then(
					function(response) {
						console.log('Records Saved!')
					},
					function(error) {
						console.log('There was an error trying to save!')
					}
				)
		})
	},

	// Bankroll Tracker -- Calculate Winnings
	calcWinnings: function(contests) {
		var prize = 0
		var nflArr = this.filterNFLContests(contests)
		nflArr.forEach(function(i) {
			var currency = numeral(i.get('Winnings_Non_Ticket')).value();
			prize = prize + currency
		})
		var result = Math.round(prize*100)/100
		return result
	},

	// Bankroll Tracker -- Calculate Fees
	calcFees: function(contests) {
		var fees = 0
		var nflArr = this.filterNFLContests(contests)
		nflArr.forEach(function(i) {
			var currency = numeral(i.get('Entry_Fee')).value();
			fees = fees + currency
		})
		var result = Math.round(fees*100)/100
		return result
	},

	// Bankroll Tracker -- Calculate Profit
	calcProfit: function(contests) {
		var winnings = this.calcWinnings(contests)
		var fees = this.calcFees(contests)
		var results = winnings - fees
		var roundedResults = Math.round(results*100)/100
		return numeral(results).format('0.00')
	},

	// Bankroll Tracker -- Calculate Return on Investment
	calcROI: function(contests) {
		var profit = this.calcProfit(contests)
		var fees = this.calcFees(contests)
		var results = (profit/fees)*100
		var roundedResults = numeral(results).format('0.00')
		return roundedResults
	},

	// Bankroll Tracker -- Calculate Win Rate
	calcWinRate: function(contests) {
		var winningNFLContests = this.filterWinningNFLContests(contests).length
		var allNFLContests = this.filterNFLContests(contests).length
		var results = (winningNFLContests/allNFLContests)*100
		var roundedResults = numeral(results).format('0.00')
		return roundedResults
	},

	// Bankroll Tracker -- Calculate Average Score
	calcAvgScore: function(contests) {
		var totalScore = 0
		var nflArr = this.filterNFLContests(contests)
		nflArr.forEach(function(i) {
			var score = numeral(i.get('Points')).value();
			totalScore += score
		})
		var result = totalScore/nflArr.length
		var roundedResult = numeral(result).format('0.00')
		return roundedResult
	},

	// Bankroll Tracker -- Calculate Average Winning Score
	calcAvgWinningScore: function(contests) {
		var totalScore = 0
		var nflArr = this.filterWinningNFLContests(contests)
		nflArr.forEach(function(i) {
			var score = numeral(i.get('Points')).value();
			totalScore += score
		})
		var result = totalScore/nflArr.length
		var roundedResult = numeral(result).format('0.00')
		return roundedResult
	},

	// Bankroll Tracker -- Figure out the last 6 calendar months
	lastSixMonths: function(d) {
		var aMonth = moment(d).subtract(1, 'month').format('M')
		var months= [], i;
		var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		for (i=0; i<6; i++) {
		 months.push(month[aMonth]);
		 aMonth--;
		 if (aMonth < 0) {
		  aMonth = 11;
		 }
		}
		return months.reverse()
	},

	// Bankroll Tracker -- Filter out all game types except NFL
	filterNFLContests: function(contests) {
		var invalidEntries = 0

		function isNFL(obj) {
			return obj === "NFL"
		}

		function filterBySport(item) {
			var sport = item.get('Sport')
		  if (isNFL(sport)) {
		    return true;
		  }
		  invalidEntries++;
		  return false;
		}

		var arrByNFL = contests.filter(filterBySport);

		return arrByNFL
	},

	// Bankroll Tracker -- Filter only winning NFL contests
	filterWinningNFLContests: function(contests) {
		var nflArr = this.filterNFLContests(contests)
		var invalidEntries = 0

		function isWinning(obj) {
			return obj !== "$0.00"
		}

		function filterByWinning(item) {
			var prize = item.get('Winnings_Non_Ticket')
		  	if (isWinning(prize)) {
		    	return true;
		  	}
			invalidEntries++;
			  return false;
		}

		var arrByWinning = nflArr.filter(filterByWinning);

		return arrByWinning
	},

	// Bankroll Tracker -- Calculate profit to chart for the last 6 months
	chartingProfit: function(contests) {
		var finalArr = [],
			d = new Date,
			totalProfit = numeral(this.calcProfit(contests)).value(),
			nflArr = this.filterNFLContests(contests),
			monthOne = 0,
			monthTwo = 0,
			monthThree = 0,
			monthFour = 0,
			monthFive = 0

		nflArr.forEach(function(i) {
			var iMonth = moment(i.get('Contest_Date_EST')).format('M/YY')
			var winnings = numeral(i.get('Winnings_Non_Ticket')).value()
			var fees = numeral(i.get('Entry_Fee')).value()

			if (iMonth === moment(d).format('M/YY')) {
				monthOne += winnings - fees

			}
			if (iMonth === moment(d).subtract(1, 'month').format('M/YY')) {
				monthTwo += winnings - fees

			}
			if (iMonth === moment(d).subtract(2, 'month').format('M/YY')) {
				monthThree += winnings - fees

			}
			if (iMonth === moment(d).subtract(3, 'month').format('M/YY')) {
				monthFour += winnings - fees

			}
			if (iMonth === moment(d).subtract(4, 'month').format('M/YY')) {
				monthFive += winnings - fees

			}

		})
		monthOne = totalProfit - monthOne
		monthTwo = monthOne - monthTwo
		monthThree = monthTwo - monthThree
		monthFour = monthThree - monthFour
		monthFive = monthFour - monthFive
		finalArr.push(totalProfit, monthOne, monthTwo, monthThree, monthFour, monthFive)

		return finalArr.reverse()
	},

}

export default ACTIONS
