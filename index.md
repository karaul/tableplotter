<!DOCTYPE html>
<html>
    <head>  
		<link rel="stylesheet" href="./node_modules/dygraphs/dist/dygraph.css">
		<script type="text/javascript"  src="./src/dygraphs/dist/dygraph.js"></script>
		<script type="text/javascript"  src="./src/dygraphs/src/extras/crosshair.js"></script>
		<script type="text/javascript"  src="./src/median-quickselect/src/median-quickselect.js"></script>
		<!-- <style type="text/css"> .annotation {}</style>   table { width: 100%; } -->
		<style type="text/css"> 				 
			.dygraph-legend {
				width: auto !important;
				min-width: 150px;
				color: rgb(17, 17, 17);
				background-color: #f0e6e6 !important; 
				padding-left:5px;
				border-color:#BABABA;
				border-style:solid;
				border-width:thin;
				transition:0s 4s;
				z-index: 80 !important;
				box-shadow: 2px 2px 5px rgba(0, 0, 0, .3);
				border-radius: 3px;
			}	
			.float-container { border: 1p;  padding: 6px;}
			.float-child1 { width: 15%; float: left; padding: 5px; }	
			.float-child2 { width: 80%; height: 600px; float: left; padding: 2px;}  
		</style>			
	</head>
    <body>

		<p> 
			<!-- <label for="myfile">Load file:</label> -->
			<!-- <input id="myfile" type="file" value='' style="padding: 20px;" />  -->
			<!-- <input id="adddata" type="checkbox" value="false"> <label for="adddata">add data from file</label>  -->
        	<!-- <p> <input id="addfile" type="file" value=''/> </p> -->        
			<!-- <label for="xaxis">Choose x-axis:</label> -->
			<!-- <select name="x" id="xaxis"> -->
				<!-- <option value="distance">distance</option>  -->
				<!-- <option value="timestamp">time</option> -->
			<!-- </select>  -->
		
		<font size=-1>&nbsp  Move mouse to see values. Click and drag to zoom. Double-click to restore</font><br/>
		</p>
		
		<div class="float-container">

			<div class="float-child1">
				<span style="display:inline-block">
					<label for="medfil1bin">Median filter size:</label> 
					<select name="mfs" id="medfil1bin" data-tip="This is the text of the tooltip2">
						<option >5</option>
						<option >4</option>
						<option selected>3</option> 
						<option >2</option>
						<option >1</option>
						<option >0</option>
						<option >30</option>
						<option >60</option>
					</select>			
					<br>&nbsp <br>
					<input id="myfile" type="file" value='' style="padding: 0px; size: 120px" /> 
					<br>&nbsp <br>
					<!-- <label for="ylist">Add to the plot:</label> <br/> -->
					<select multiple name="y" id="ylist"  size=21 style="min-width: 100px;  text-overflow: ellipsis">
						<option disabled value=0 style="font-style: italic; font-weight: bold;"> Data to add: </option>
					</select> <br/>	
					&nbsp <br>
					<label for="yside" style="border: 1p;">y-axis:</label> 	<select name="yside" id="yside">
						<option selected value='y'>left</option> 
						<option value='y2'>right</option>
					</select style="padding: 5x;"><br/>	
					&nbsp <br>
					<!-- <label for="ylist2">Remove from the plot:</label> <br/> -->
					<select multiple name="y2" id="ylist2" size=8 style="min-width: 100px;  text-overflow: ellipsis">
						<option disabled value=0 style="font-style: italic; font-weight: bold;"> Remove: </option>
					</select>	
					<br>
					<input id="clean" type="button" value='Remove all'/> 
				</span>
			</div>
			
			
			<div  class="float-child2" id="plotarea"></div>
			
			<div  class="dygraph-legend" id="legend" style="position:fixed; top:20px; right:0px;"></div>
			
		  </div>
		
    </body>

		<script type="text/javascript" src="./src/index.js"></script> 

</html>