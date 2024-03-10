function preload() {
  game.load.onLoadStart.add(loadStart, this);
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);
  loadText = game.add.text(32, 32, '', {
    fill: '#ffffff',
  });
  
this.load.path = '../assets/images/';
  this.load.image('background_slice', 'background_slice.png');
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
  this.load.image('upperArm', 'upper_arm.png');
  this.load.image('lowerArm', 'lower_arm.png');
  this.load.image('body', 'torso.png');
  this.load.image('thigh', 'thigh.png');
  this.load.image('leg', 'lower_leg.png');
  this.load.image('head', 'head.png');
  this.load.image('foot', 'foot.png');
  this.load.image('marker', 'marker.png');
  this.load.image('q', 'q.png');
  this.load.image('w', 'w.png');
  this.load.image('o', 'o.png');
  this.load.image('p', 'p.png');
 this.load.start();

}

function loadStart() {
  loadText.setText('Loading ...');
}

function loadComplete() {
  loadText.setText('Load Complete');
  loadText.destroy();
}
//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {

  loadText.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);


}