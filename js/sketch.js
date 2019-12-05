let w = 400, h = 300, hw = w/2.0, hh = h/2.0;
let cnv, cam, ctracker, pos = [];
let bg;
let inco; let facelayer, toplayer;
let fidx = 0, numfaces = 2, maxzoom = 1.075;
let alphaincr = 255.0/numfaces, zoomincr = (maxzoom - 1.0)/numfaces;
let berryfiles = ["res/berry0.jpg", "res/berry1.jpg", "res/berry2.jpg", "res/berry3.jpg", "res/berry4.jpg"];
let berry = Array.from({length: berryfiles.length});;
let berrytint = [[0, 255, 128], [51, 153, 255], [255, 102, 255], [255, 153, 51], [204, 153, 255]];
let bgdur = 500;

let slice_width, slice_idx, slice_prop, slice_dir, horiz = false, num_slices = 20;
let slicing, slicing_ch = 50, slice_refresh = 100, last_slrefresh = -99999;


function slice_instantiate(n_slices)
{
	slice_prop = Array.from({length: n_slices}, (x, i) => random(2,3.75));
	slice_dir = Array.from({length: n_slices}, (x, i) => coin_flip());
 
}

function preload()
{
    inco = loadFont('res/Inconsolata.otf');
    bg = loadImage('res/hazy.jpg');
    for(let i = 0; i < berryfiles.length; i++)
    {
	berry[i] = loadImage(berryfiles[i]);
    };
}

function slice_draw(cur_ms, n_slices)
{
    if((cur_ms - last_slrefresh) > slice_refresh)
    {
	last_slrefresh = cur_ms;
	slicing = random(100) <= slicing_ch;
	slice_instantiate(num_slices);
    };
    
    if(slicing == true)
    {
	for(let i =0 ; i < n_slices; i++)
	{

	    let cur_dir = slice_dir[i];
	    let cur_prop = slice_prop[i];
	    let cur_amt = cur_prop*cur_dir;

	    if(horiz == true)
		draw_strip(toplayer, 0, 0, 0, i, cur_amt, slice_width);
	    else draw_strip(toplayer, 1, 0, 0, i, cur_amt, slice_width);

	};
    }
    else image(toplayer,0,0,w,h);

}

function slice_setup(cur_w, cur_h, n_slices, horizontal)
{

    if(horizontal == true) slice_width = Math.round(cur_h/n_slices);
    else slice_width = Math.round(cur_w/n_slices);
    slice_idx= Array.from({length: n_slices}, (y,idx) => idx * slice_width);
    slice_instantiate(n_slices);
    last_slfrefresh = millis();
}

function setup()
{
    //frameRate(12);
    console.log("start");
    cam = load_cam();
    cam.hide();
    ctracker = load_tracker(cam);
    cnv = load_canvas(w,h);
    facelayer = Array.from({length: numfaces},() => createGraphics(w,h));
    toplayer = createGraphics(w,h);
    textFont(inco);
    textSize(height / 30);
    fill(255);
    textAlign(CENTER, CENTER);
    toplayer.imageMode(CENTER);
    slice_setup(w, h, num_slices, horiz);
}

function draw_eye(eye_arr)
{
    facelayer[fidx].beginContour();
   for(var i =1; i < eye_arr.length; i++)
    {
	let cur_idx = eye_arr[i];
	let cur_x = pos[cur_idx][0];
	let cur_y = pos[cur_idx][1];

	//circle(cur_x, cur_y, 5);
	facelayer[fidx].vertex(cur_x, cur_y);
    };

    facelayer[fidx].endContour();
}

function draw_mouth()
{
    facelayer[fidx].beginContour();
   for(var i =1; i < innermouth.length; i++)
    {
	let cur_idx = innermouth[i];
	let cur_x = pos[cur_idx][0];
	let cur_y = pos[cur_idx][1];

	//circle(cur_x, cur_y, 5);
	facelayer[fidx].vertex(cur_x, cur_y);
    };

    facelayer[fidx].endContour();
}

function drawlayers()
{
    //toplayer.fill(255,50);
    //toplayer.noStroke();
    //toplayer.rect(0,0,w,h);


    let curface = (fidx + 1) % numfaces;
    let curalpha = alphaincr;
    let curzoom =  maxzoom;
    

    toplayer.clear();

    for(let i=0 ; i < numfaces; i++)
    {
	toplayer.tint(255, curalpha);
	toplayer.image(facelayer[fidx], hw, hh, w*curzoom, h*curzoom);
	curalpha += alphaincr;
	curzoom -= zoomincr;
	curface = (i + curface) % numfaces;
    };
    toplayer.noTint();
    fidx = (fidx + 1) % numfaces;
}

function drawparts(cur_ms)
{

    //toplayer.fill(255,50);
    //toplayer.noStroke();
    //toplayer.rect(0,0,w,h);
    facelayer[fidx].image(cam,0,0,w,h);
    facelayer[fidx].erase();
    facelayer[fidx].beginShape();
    facelayer[fidx].vertex(0,h);
    facelayer[fidx].vertex(w,h),
    facelayer[fidx].vertex(w,0);
    facelayer[fidx].vertex(0,0);
    draw_eye(lefteye);
    draw_eye(righteye);
    draw_mouth();
    facelayer[fidx].endShape(CLOSE);
    facelayer[fidx].noErase();
    //toplayer.image(facelayer,0,0,w,h);

    //image(toplayer,0,0,w,h);
    drawlayers();

    slice_draw(cur_ms, num_slices);
}

function draw_pos()
{
    for(var i =0; i < pos.length; i++)
    {
	let cur_x = pos[i][0];
	let cur_y = pos[i][1];

	//circle(cur_x, cur_y, 5);
	text(i, cur_x, cur_y);
    }
}

function draw()
{
    //clear();
    pos = get_pos(ctracker);
    let cur_ms = millis();
    if(pos.length > 0)
    {
	let cur_idx = Math.floor(millis()/bgdur) % berryfiles.length;
	let cur_tint = berrytint[cur_idx];
	imageMode(CENTER);
	tint(cur_tint[0], cur_tint[1], cur_tint[2]);

	//fill(0,255,0);



	//tint(255,100);
	image(berry[cur_idx], hw, hh);
	noTint();
	imageMode(CORNER);
	drawparts(cur_ms);
	//image(toplayer,0,0,w,h);

	//draw_pos();
	//eyehit(pos, lefteye);
	/*
	if(leftthresh == true)
	{
	    blankeye(pos,lefteye);
	    //console.log("BLANKING");

	}
	*/
	//console.log(leftthresh);
	//rightthresh = eyeopen(pos, righteye);
	//console.log(rightthresh);
//	mouthhit(pos, innermouth);

    };
}

function draw_strip(img, horiz_vert, dest_x, dest_y, cur_idx, shift_amt, strip_size)
{
    let s_x, s_y, d_x, d_y, c_w, c_h;
    // if we are starting within the bounds
    let can_draw = false, can_copy = false;
    let real_idx = cur_idx * strip_size;
    //horizontal
    if(horiz_vert == 0)
    {
	// strip dest idx we want
	let copy_x = 0;
	let copy_y = real_idx;
	let want_idx = real_idx + dest_y; //draw_y
	let want_shift = shift_amt + dest_x; //draw_x
	let want_h = strip_size;
	let want_w = img.width;
	if(want_shift + want_w >= width) want_w = width - want_shift;
	else if (want_shift < 0)
	{
	    copy_x = -1.0* want_shift;
	    want_w = want_w + want_shift;
	};
	if(want_idx  + want_h > height) want_h = height - want_idx;
	else if(want_idx < 0)
	{
	    copy_y = -1.0 * want_idx;
	    want_h = strip_size + want_idx;
	}
	can_draw = want_w > 0 && want_shift < width && want_idx < height;
	can_copy = real_idx < img.height && want_h > 0 && want_w > 0;

	d_x = want_shift;
	d_y = want_idx;
	c_w = want_w;
	c_h = want_h;
	s_y = real_idx;
	s_x = copy_x;
	s_y = copy_y;
    }
    else
    {
	// vertical
	let copy_x = real_idx;
	let copy_y = 0;
	let want_idx = real_idx + dest_x; //draw_x
	let want_shift = shift_amt + dest_y; //draw_y
	let want_h = img.height;
	let want_w = strip_size;
	if(want_shift + want_h >= height) want_h = height - want_shift;
	else if (want_shift < 0){
	    copy_y = -1.0* want_shift;
	    want_h = want_h + want_shift;
	};
	if(want_idx  + want_w > height) want_w = width - want_idx;
	else if(want_idx < 0)
	{
	    copy_x = -1.0 * want_idx;
	    want_w = strip_size + want_idx;
	};
	can_draw = want_w > 0 && want_shift < height && want_idx < width;
	can_copy = real_idx < img.width && want_h > 0 && want_w > 0;

	d_x = want_idx;
	d_y = want_shift;
	c_w = want_w;
	c_h = want_h;
	s_x = copy_x;
	s_y = copy_y;
	

	
    };

    if(can_draw && can_copy)
    {
	copy(img, s_x, s_y, c_w, c_h, d_x, d_y, c_w, c_h);
    }
}


function coin_flip()
{
    let cur = random(100);
    if(cur >= 50) return 1;
    else return -1;
}

window.onerror = function(error) {
    alert(error);
};

