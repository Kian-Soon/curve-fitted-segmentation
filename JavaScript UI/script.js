/* ------------------------------*/
// Set-up global variables for User-Interface-1

Points = [];     // array to store plotting points     
output = [];     // array to store output value
removedPoints =[];     // array to store removed points   
original_array_index = []     // array to store original array index 


/* ------------------------------*/
// Set-up global variables for User-Interface-2

binaryFile =[]    
inputCoordinates=[]     
plottingPoints=[]    
curve=[]


/* ------------------------------*/
// Function for plotting catmullRomSpline for User-interface-1&2

function CatmullRomSpline(P0, P1, P2, P3, nPoints = 100) {
	var alpha = 0.5
	alpha = alpha / 2

	function tj(ti, Pi, Pj) {
	const [xi, yi] = Pi;
    const [xj, yj] = Pj;
    return ((xj - xi) ** 2 + (yj - yi) ** 2) ** alpha + ti;
	}

	var t0 = 0
	var t1 = tj(t0, P0, P1)
	var t2 = tj(t1, P1, P2)
	var t3 = tj(t2, P2, P3)

	function linspace(start, stop, nPoints) {
	var t = [];
    var step = (stop - start) / (nPoints - 1);
    for (var i = 0; i < nPoints; i++) {
      t.push(start + (step * i));
    }
    return t;
	}

	var t = linspace(t1, t2, nPoints)
	t = math.reshape(t, [t.length, 1])

	var A11 = math.divide(math.subtract(t1, t), math.subtract(t1, t0))
	var c1 = []
	for (var i = 0; i < A11.length; i++) {
    var interim = math.multiply(P0, A11[i][0])
    c1.push(interim)
	}
	var A12 = math.divide(math.subtract(t, t0), math.subtract(t1, t0))
	var c2 = []
	for (var i = 0; i < A12.length; i++) {
    var interim = math.multiply(P1, A12[i][0])
    c2.push(interim)
	}
	var A1 = math.add(c1, c2)

	var A21 = math.divide(math.subtract(t2, t), math.subtract(t2, t1))
	var c1 = []
	for (var i = 0; i < A21.length; i++) {
    var interim = math.multiply(P1, A21[i][0])
    c1.push(interim)
	}
	var A22 = math.divide(math.subtract(t, t1), math.subtract(t2, t1))
	var c2 = []
	for (var i = 0; i < A22.length; i++) {
    var interim = math.multiply(P2, A22[i][0])
    c2.push(interim)
	}
	var A2 = math.add(c1, c2)

	var A31 = math.divide(math.subtract(t3, t), math.subtract(t3, t2))
	var c1 = []
	for (var i = 0; i < A31.length; i++) {
    var interim = math.multiply(P2, A31[i][0])
    c1.push(interim)
	}
	var A32 = math.divide(math.subtract(t, t2), math.subtract(t3, t2))
	var c2 = []
	for (var i = 0; i < A32.length; i++) {
    var interim = math.multiply(P3, A32[i][0])
    c2.push(interim)
	}
	var A3 = math.add(c1, c2)

	var B11 = math.divide(math.subtract(t2, t), math.subtract(t2, t0))
	var c1 = []
	for (var i = 0; i < B11.length; i++) {
    var interim = math.multiply(A1[i], B11[i][0])
    c1.push(interim)
	}
	var B12 = math.divide(math.subtract(t, t0), math.subtract(t2, t0))
	var c2 = []
	for (var i = 0; i < B12.length; i++) {
    var interim = math.multiply(A2[i], B12[i][0])
    c2.push(interim)
	}
	var B1 = math.add(c1, c2)

	var B21 = math.divide(math.subtract(t3, t), math.subtract(t3, t1))
	var c1 = []
	for (var i = 0; i < B21.length; i++) {
    var interim = math.multiply(A2[i], B21[i][0])
    c1.push(interim)
	}
	var B22 = math.divide(math.subtract(t, t1), math.subtract(t3, t1))
	var c2 = []
	for (var i = 0; i < B22.length; i++) {
    var interim = math.multiply(A3[i], B22[i][0])
    c2.push(interim)
	}
	var B2 = math.add(c1, c2)

	var C11 = math.divide(math.subtract(t2, t), math.subtract(t2, t1))
	var c1 = []
	for (var i = 0; i < C11.length; i++) {
    var interim = math.multiply(B1[i], C11[i][0])
    c1.push(interim)
	}
	
	var C12 = math.divide(math.subtract(t, t1), math.subtract(t2, t1))
	var c2 = []
	for (var i = 0; i < C12.length; i++) {
    var interim = math.multiply(B2[i], C12[i][0])
    c2.push(interim)
	}
	
	var C = math.add(c1, c2)
	return C
}

function CatmullRomChain(P, nPoints = 100) {
	var sz = P.length
	var curve = []
	var j = 0
	while (j < sz - 3) {
    var c = CatmullRomSpline(P[j].slice(), P[j + 1].slice(), P[j + 2].slice(), P[j + 3].slice())
    for (var i=0; i<nPoints; i++)
    curve.push(c[i])
		j++
	}
	return curve
	}


/* ------------------------------*/
// Function to detect real mouse coordinates for User-interface-1&2

function realMouseCoords(canvas, event) { 
	var rect = canvas.getBoundingClientRect(); 
	var x = event.clientX - rect.left; 
	var y = event.clientY - rect.top; 
	return {x:x, y:y};
	}
	
	
/* ------------------------------*/
// Function to calculate distance between points for User-interface-1&2
	
function distance2( p1, p2 ) {
	var delx = p1[0] - p2[0];
	var dely = p1[1] - p2[1];
	var dist2 = Math.pow( delx, 2 ) + Math.pow( dely, 2 );
	return dist2;
    }


/* ------------------------------*/
// Function to initialise global variables for User-interface-1

function initialize(){
	Points = originalArray.slice();     // array to store plotting points     
	removedPoints = []     // array to store removed points   
	output = new Array(originalArray.length).fill(1);     // array to store output value
	}


/* ------------------------------*/
// Function to set-up base image for User-Interface-1

make_base();

function make_base()
{
  var c1 = document.getElementById("layer1_1")
  var ctx1 = c1.getContext("2d")
  var base_image = new Image();
  base_image.src = '12.png';
  base_image.onload = function(){
    ctx1.drawImage(base_image, 0, 0);
  }
}

		
/* ------------------------------*/
// Function for drawing curve for User-interface-1

function drawCurve(){
	curve = CatmullRomChain(Points)
	var c1 = document.getElementById("layer1_1");
	var ctx1 = c1.getContext("2d")	
	var c2 = document.getElementById("layer1_2");
	var ctx2 = c2.getContext("2d")
	c2.width = c1.width
	c2.height = c1.height	
	ctx2.clearRect(0, 0, c2.width, c2.height);
	ctx2.beginPath();
	ctx2.moveTo(Points[1][0], Points[1][1]);
	for (var i = 0; i < curve.length; i++) {
		ctx2.lineTo(curve[i][0], curve[i][1]);}
	ctx2.stroke();
	ctx2.fillStyle="rgba(255, 0, 0, 0.5)";
	ctx2.fill();
	for(var i = 0; i < Points.length; i++) {
	ctx2.fillStyle = "green";
	ctx2.fillRect(Points[i][0] - 6/2, Points[i][1] - 6/2, 6, 6)}
	for(var i = 0; i < removedPoints.length; i++) {
	ctx2.fillStyle = "red";
	ctx2.fillRect(removedPoints[i][0] - 6/2, removedPoints[i][1] - 6/2, 6, 6)
	}
	display_metrics();
	}


/* ------------------------------*/
// Function to upload image onto canvas for User-interface-1

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
	var c1 = document.getElementById("layer1_1");
	var ctx1 = c1.getContext("2d")
	ctx1.globalAlpha = 0.2;
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            c1.width = img.width;
            c1.height = img.height;
            ctx1.drawImage(img,0,0);	
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

/* ------------------------------*/	
//Function to upload coordinates in json for User-interface-1

var jsonLoader = document.getElementById('jsonLoader');
jsonLoader.addEventListener('change', handleJson, false);

function handleJson(e){
	var files = document.getElementById('jsonLoader').files;
	if (files.length <= 0) {return false;}
	var fr = new FileReader();
	fr.onload = function(e) { 
	originalArray = JSON.parse(e.target.result);
	initialize()
	drawCurve()
	}
	fr.readAsText(files.item(0));
}


/* ------------------------------*/
// Mouse click functions for User-interface-1

clickCount = 0;
var c2 = document.getElementById("layer1_2"); 
c2.addEventListener('click', function(e)     //to differentiate between single and double click
	{
    clickCount++;
    if (clickCount === 1) {
        singleClickTimer = setTimeout(function() {
            clickCount = 0;
            singleClick(e);
        }, 800);
    } else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
        doubleClick(e);
    }
	}, false);

function singleClick(e){
	var c2 = document.getElementById("layer1_2");
	var ctx2 = c2.getContext("2d")
	ctx2.clearRect(0, 0, c2.width, c2.height);
	click_pt = realMouseCoords(c2, e); 
	var reinstatePoint = reinstate_point( click_pt )
	removedPoints.splice(reinstatePoint.index, 1)
	Points = originalArray.slice()
	for (i = 0; i < removedPoints.length; i++) {
	for (j = 0; j < Points.length; j++){
	if (removedPoints[i][0] == Points[j][0] && removedPoints[i][1] == Points[j][1] ){
	Points.splice(j, 1);
	}}}
	original_array_index = originalarrayindex(reinstatePoint.point)
	outputarray(original_array_index, 1) 
	drawCurve()
	}

function doubleClick(e){
	var c2 = document.getElementById("layer1_2");
	var ctx2 = c2.getContext("2d")
	ctx2.clearRect(0, 0, c2.width, c2.height);
	click_pt = realMouseCoords(c2, e); 
	var nearest_pt = find_nearest_point_db_click( click_pt );
	index = nearest_pt.index
	pt = Points[index]
	removedPoints.push(pt) 
	original_array_index = originalarrayindex(pt)
	outputarray(original_array_index, 0)
	Points.splice(index, 1);
	drawCurve()
	}
	
function find_nearest_point_db_click( click_pt ) {	
			var index = 0;
            var near_pt = Points[ index ];
            var dist = distance2( near_pt, [click_pt.x, click_pt.y] );
			for( var i = 1; i < Points.length; i++ ) {
                var test_pt   = Points[ i ];
                var test_dist = distance2( test_pt, [click_pt.x, click_pt.y] );
                if( test_dist < dist ) {
                    dist = test_dist;
                    index = i;
                }
            }
            return {dist: dist, index: index};
			}
	
	
/* ------------------------------*/	
// Function to find added point for User-interface-1

function reinstate_point( click_pt ) {
	index = 0
	var point = removedPoints[ index ];
	var dist = distance2( point, [click_pt.x, click_pt.y] );
	for( var i = 1; i < removedPoints.length; i++ ) {
		var test_pt   = removedPoints[ i ];
		var test_dist = distance2( test_pt, [click_pt.x, click_pt.y] );
		if( test_dist < dist ) {
			dist = test_dist;
			point = test_pt
			index = i;}
			}
	return {point: point, index: index};
	}


/* ------------------------------*/
// Function to find index in original array for User-interface-1

function originalarrayindex( pt ) {
	original_array_index = 0
	for(var i = 0; i < originalArray.length; i++) {
		if (originalArray[i][0]==pt[0] && originalArray[i][1]==pt[1]){
		original_array_index = i
		break;
		}
	}
	return original_array_index
	}


/* ------------------------------*/
// Function to update output array for User-interface-1

function outputarray( idx, toggle ) {
	output[idx] = toggle;
	return output
	}
	
	


/* ------------------------------*/
// Function to download result in json for User-interface-1

function downloadJson(){  
	filename = extractFilename()
	filename = filename.filename + "_Bin" + ".json"
	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output));
    var tmpLink = document.createElement( 'a' );     // create temporary link  
    tmpLink.download = filename
    tmpLink.href = 'data:' + data;
    document.body.appendChild( tmpLink );     // temporarily add link to body and initiate the download  
    tmpLink.click();  
    document.body.removeChild( tmpLink );  
}


/* ------------------------------*/
// Function to calculate IOU metrics for User-interface-1

function display_metrics(){
var c1 = document.getElementById("layer1_1");
var ctx1 = c1.getContext("2d")
var img_data_ctx1 = ctx1.getImageData(0, 0, c1.width, c1.height);
img_data_ctx1 = img_data_ctx1.data 
img_data_ctx1 = Array.from(img_data_ctx1);
var img_greyscale_ctx1 = []
	for( var i = 0; i < img_data_ctx1.length/4; i++ ){
		img_greyscale_ctx1.push(img_data_ctx1[4*i])}
	for( var i = 0; i < img_greyscale_ctx1.length; i++ ){
		if (img_greyscale_ctx1[i] > 0){
			img_greyscale_ctx1[i] = 1}}

var c2 = document.getElementById("layer1_2");
var ctx2 = c2.getContext("2d")
var img_data_ctx2 = ctx2.getImageData(0, 0, c2.width, c2.height);
img_data_ctx2 = img_data_ctx2.data 
var img_data_ctx2 = Array.from(img_data_ctx2);
img_greyscale_ctx2 = []
	for( var i = 0; i < img_data_ctx2.length/4; i++ ){
		img_greyscale_ctx2.push(img_data_ctx2[4*i])}

	for( var i = 0; i < img_greyscale_ctx2.length; i++ ){
		if (img_greyscale_ctx2[i] > 0){
			img_greyscale_ctx2[i] = 1}}

var intersect = math.dot(img_greyscale_ctx1, img_greyscale_ctx2)
var union = math.sum(img_greyscale_ctx1) + math.sum(img_greyscale_ctx2) - intersect
var ratio = intersect/union
ratio = ratio.toFixed(5)

  var x = document.getElementById("myTable").rows[0].cells;
  x[1].innerHTML = ratio
  var x = document.getElementById("myTable").rows[1].cells;
  x[1].innerHTML = originalArray.length;
  var x = document.getElementById("myTable").rows[2].cells;
  x[1].innerHTML = Points.length;
}


// Function to extract filename of uploaded mask for User-interface-1

function extractFilename() {
  var filename = document.getElementById("imageLoader").value;
  filename = filename.replace(/.*[\/\\]/, '').split(".")[0]
  return {filename: filename};
}


/* ------------------------------*/
// Function to set-up base image for User-Interface-2

make_base01();

function make_base01()
{
  var c1 = document.getElementById("layer2_1");
  var ctx1 = c1.getContext("2d")
  var base_image = new Image();
  base_image.src = '12.png';
  base_image.onload = function(){
    ctx1.drawImage(base_image, 0, 0);
  }
}


/* ------------------------------*/
// Function to upload image onto canvas for User-interface-2

var imageLoader01 = document.getElementById('imageLoader01');
imageLoader01.addEventListener('change', handleImage01, false);

function handleImage01(e){
	var c1 = document.getElementById("layer2_1");
	var ctx1 = c1.getContext("2d")
	ctx1.globalAlpha = 0.2;
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            c1.width = img.width;
            c1.height = img.height;
            ctx1.drawImage(img,0,0);	
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}


/* ------------------------------*/	
//Function to upload coordinates in json for User-interface-2

var jsonLoader01 = document.getElementById('jsonLoader01');
jsonLoader01.addEventListener('change', handleJson01, false);

function handleJson01(e){
	var files = document.getElementById('jsonLoader01').files;
	if (files.length <= 0) {return false;}
	var fr = new FileReader();
	fr.onload = function(e) { 
	inputCoordinates = JSON.parse(e.target.result);
	}
	fr.readAsText(files.item(0));
}


/* ------------------------------*/	
//Function to upload binary file in json for User-interface-2

var jsonLoader02 = document.getElementById('jsonLoader02');
jsonLoader02.addEventListener('change', handleJson02, false);

function handleJson02(e){
	var files = document.getElementById('jsonLoader02').files;
	if (files.length <= 0) {return false;}
	var fr = new FileReader();
	fr.onload = function(e) { 	
	binaryFile = JSON.parse(e.target.result);
	for (var i = 0; i < binaryFile.length; i++){
	if (binaryFile[i] == 1){plottingPoints.push(inputCoordinates[i]);}}	
	var offsetBegin0 = plottingPoints[0]     	//Artifically duplicate 3 more points to close up the gap in the curve
	var offsetBegin1 = plottingPoints[1]
	var offsetBegin2 = plottingPoints[2]
	plottingPoints.push(offsetBegin0)
	plottingPoints.push(offsetBegin1)
	plottingPoints.push(offsetBegin2)
	drawCurve01()
	}
	fr.readAsText(files.item(0));
}


/* ------------------------------*/
// Function to draw curve and mark up points for User-interface-2

function drawCurve01(){
	curve = CatmullRomChain(plottingPoints)
	var c1 = document.getElementById("layer2_1");
	var ctx1 = c1.getContext("2d")	
	var c2 = document.getElementById("layer2_2");
	var ctx2 = c2.getContext("2d")
	c2.width = c1.width
	c2.height = c1.height
	ctx2.clearRect(0, 0, c2.width, c2.height);
	ctx2.lineWidth = 5;
	ctx2.strokeStyle = "#FFFFFF";
	ctx2.beginPath();
	ctx2.moveTo(plottingPoints[1][0], plottingPoints[1][1]);
	for (var i = 0; i < curve.length; i++) {
		ctx2.lineTo(curve[i][0], curve[i][1]);}
	ctx2.stroke();
	ctx2.fillStyle="rgba(255, 0, 0, 0.5)";
	ctx2.fill();
	if (mark_up == 1)
	{for(var i = 0; i < plottingPoints.length-1; i++) {
	ctx2.fillStyle = "green";
	ctx2.fillRect(plottingPoints[i][0] - 6/2, plottingPoints[i][1] - 6/2, 6, 6)}
	}}


/* ------------------------------*/
// Mouse click functions for User-interface-2

clickCount = 0;
var c2 = document.getElementById("layer2_2"); 
c2.addEventListener('click', function(e)     //to differentiate between single, double click and drag
	{
	if (!(e.shiftKey)){
	{
    clickCount++;
    if (clickCount === 1) {
        singleClickTimer = setTimeout(function() {
            clickCount = 0;
            singleClick01(e);
        }, 800);
    } else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
        doubleClick01(e);
    }
	}
	}
 	}, false);
	
function singleClick01(e){
	var c2 = document.getElementById("layer2_2");
	var ctx2 = c2.getContext("2d")
	ctx2.clearRect(0, 0, c2.width, c2.height);
	var click_pt = realMouseCoords(c2, e); 
	var nearest_pt = find_nearest_point_single_click( click_pt );
	var index = nearest_pt.index
	plottingPoints.splice(index, 0, [click_pt.x, click_pt.y]);
	drawCurve01()
	}
	
function doubleClick01(e){
	var c2 = document.getElementById("layer2_2");
	var ctx2 = c2.getContext("2d")
	ctx2.clearRect(0, 0, c2.width, c2.height);
	var click_pt = realMouseCoords(c2, e); 
	var nearest_pt = find_nearest_point( click_pt );
	var index = nearest_pt.index
	if (index == 0  || index == 1 || index == plottingPoints.length -1 || index == plottingPoints.length -2){
	drawCurve01()
	alert("Control point of spline is fixed! Pls choose another point.");}
	else{
	plottingPoints.splice(index, 1);
	drawCurve01()}
	}

function find_nearest_point( click_pt ) {	
			var index = 0;
            var near_pt = plottingPoints[ index ];
            var dist = distance2( near_pt, [click_pt.x, click_pt.y] );
			for( var i = 1; i < plottingPoints.length; i++ ) {
                var test_pt   = plottingPoints[ i ];
                var test_dist = distance2( test_pt, [click_pt.x, click_pt.y] );
                if( test_dist < dist ) {
                    dist = test_dist;
                    index = i;
                }
            }
            return {dist: dist, index: index};
    }	

function find_nearest_point_single_click( click_pt ) {	
	var index = 0;
	var near_pt = curve[ index ];
	var dist = distance2( near_pt, [click_pt.x, click_pt.y] );
	for( var i = 1; i < curve.length; i++ ) {
		var test_pt   = curve[ i ];
		var test_dist = distance2( test_pt, [click_pt.x, click_pt.y] );
			if( test_dist < dist ) {
			dist = test_dist;
			index = i;}}
	index = Math.ceil(index/100)+1
	return {dist: dist, index: index};
    }

var c2 = document.getElementById("layer2_2")
c2.addEventListener("mousedown", mouseDown)
c2.addEventListener("mouseup", mouseUp)

index_global = 0
function mouseDown(e) {
	if (e.shiftKey){
	var c2 = document.getElementById("layer2_2");
	var ctx2 = c2.getContext("2d")
	var click_pt = realMouseCoords(c2, e); 
	var nearest_pt = find_nearest_point( click_pt );
	var index = nearest_pt.index
	if (index == 0  || index == 1 || index == plottingPoints.length -1 || index == plottingPoints.length -2){
	drawCurve01()
	alert("Control point of spline is fixed! Pls choose another point.");}
	else{
	index_global = nearest_pt.index}
	}}

function mouseUp(e) {
	if (e.shiftKey){
	var c2 = document.getElementById("layer2_2");
	var ctx2 = c2.getContext("2d")
	var replacement_pt = realMouseCoords(c2, e); 
	plottingPoints.splice(index_global, 1, [replacement_pt.x, replacement_pt.y])
	drawCurve01()
	}
  }


/* ------------------------------*/
// Function to download canvas for User-interface-2

mark_up = 1
function downloadCanvas(){  
	mark_up = 0
	var c2 = document.getElementById("layer2_2");
	var ctx2 = c2.getContext("2d")
	drawCurve01()
	ctx2.globalCompositeOperation = 'destination-over';
	ctx2.fillStyle = 'black';
	ctx2.fillRect(0, 0, c2.width, c2.height);
    var image = c2.toDataURL();  
    var tmpLink = document.createElement( 'a' );     // create temporary link    
    tmpLink.download = 'image.png';     // set the name of the download file 
    tmpLink.href = image;  
    document.body.appendChild( tmpLink );     // temporarily add link to body and initiate the download  
    tmpLink.click();  
    document.body.removeChild( tmpLink );
	mark_up = 1
	drawCurve01()
}

function openPage(evt, pgName) {
	// Declare all variables
	var i, tabcontent, tablinks;
  
	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
  
	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
  
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(pgName).style.display = "block";
	evt.currentTarget.className += " active";
  }

document.getElementById("defaultOpen").click();