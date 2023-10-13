var dogBarkingBuffer = null;
var context = new AudioContext();

function loadDogSound(url : any) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
        dogBarkingBuffer = buffer;
    }, );
    }
    request.send();
}