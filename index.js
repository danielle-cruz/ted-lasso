
d3.csv("data/emotions/EmotionsData.csv",
    function(d) {
        return {
            ep: d.ep,
            sentiment: +d.sentiment_score, 
            sadness: +d.sadness,
            joy: +d.joy,
            fear: +d.fear,
            disgust: +d.disgust,
            anger: +d.anger,

	    };
    }).then(function(emotionsData) {

      console.log(emotionsData);
      console.log(document.querySelector('#basic'))
      var waypoint = new Waypoint({
        element: document.querySelector('#basic'),
        handler: function() {
          console.log('hi')
        }
      })
    }
);

d3.csv("data/apologies/ApologiesData.csv",
    function(d) {
        return {
            id: d.Id,
            ep: d.Episode,
            from: d.Apologizer,
            to: d.Apologee,
            from_gender: d.Apologizer_Gender,
            to_gender: d.Apologee_Gender,
            power: d.More_Power,
            response: d.Response,
            text: d.Text,
	    };
    }).then(function(apologiesData) {
      console.log(apologiesData);
    }
);