document.addEventListener("DOMContentLoaded", function () {
	
  function guessDelimiters(text, possibleDelimiters) {
    return possibleDelimiters.filter(weedOut);

    function weedOut(delimiter) {
      var cache = -1;
      return text.split("\n").every(checkLength);

      function checkLength(line) {
        if (!line) {
          return true;
        }

        var length = line.split(delimiter).length;
        if (cache < 0) {
          cache = length;
        }
        return cache === length && length > 1;
      }
    }
  }

  function transpose(a) {
    return a[0].map(function (_, c) {
      return a.map(function (r) {
        return r[c];
      });
    });
  }

  function medfilter(a, bin) {
    var bin2p1 = 1 + 2 * bin,
      n = a.length;
    var dm = Array(1 + 2 * bin).fill(a[0]);
    af = [];
    for (var i = 0; i < n; i++) {
      for (var k = 0; k < bin2p1; k++) {
        var ipk = i + k - bin;
        dm[k] = ipk >= 0 ? (ipk < n ? a[ipk] : a[n - 1]) : a[0];
      }
      af.push(median(dm));
    }
    return af;
  }

  /*  function medfilter(a, bin){
		var t=0, n = a.length, af=[];
		for (var i = 0; i < n; i++) {
			if ( i-bin < 0 ) {
				t = a[0];
			} else if ( i+bin+1 >= n) {
				t = a[n-1];
			} else {
                t = median(a.slice(i-bin,i+bin+1));
			}
			af.push( t );
		}
		return af;
	}					
*/

  document.getElementById("clean").onclick = function (e) {
    document.getElementById("ylist").value = 0;
    data_plot = [];
    data_plot.push(data[0]);
    labels_plot = ["time"];
    series_plot = {};

    dyplot.updateOptions({
      file: [
        [0, 1],
        [0, 1],
      ],
      title: filename,
      labels: ["x", "y"],
    });
    var options2 = document.getElementById("ylist2").options;
    var n = options2.length;
    for (var i = n - 1; i > 0; i--) {
      document.getElementById("ylist").options[
        options2[i].value
      ].disabled = false;
      document.getElementById("ylist2").removeChild(options2[i]);
    }
  };

  document.getElementById("ylist2").onchange = function (e) {
    // remove data
    var sensor = document.getElementById("ylist2");
    var namesensor = sensor.options[sensor.selectedIndex].text;
    const ind = labels_plot.indexOf(namesensor);
    if (ind < 0) return; // does not exist, error ?
    labels_plot.splice(ind, 1);
    data_plot.splice(ind, 1);
    dyplot.updateOptions({
      file: transpose(data_plot),
      labels: labels_plot,
    });
    document.getElementById("ylist").options[
      sensor.options[sensor.selectedIndex].value
    ].disabled = false;
    sensor.removeChild(sensor.options[sensor.selectedIndex]);
    delete series_plot[[namesensor]];
  };

  document.getElementById("ylist").onchange = document.getElementById(
    "medfil1bin"
  ).onchange = function (e) {
    // add data
    var sensor2 = document.getElementById("ylist2");
    var sensor = document.getElementById("ylist");
    var ksensor = sensor.value;
    for (var i = 1; i < sensor2.options.length; i++) {
      if (sensor2.options[i].value === ksensor) return;
    }
    var namesensor = sensor.options[sensor.selectedIndex].text;
    //console.log(namesensor+ " " + ksensor);
    var bin = document.getElementById("medfil1bin").value;
    data_plot.push(medfilter(data[ksensor], bin));
    labels_plot.push(namesensor);
    Object.assign(series_plot, {
      [namesensor]: { axis: document.getElementById("yside").value },
    });
    //console.log(series_plot);
    //console.log(document.getElementById('yside').value);
    dyplot.updateOptions({
      file: transpose(data_plot),
      labels: labels_plot,
      series: series_plot,
    });
    sensor2.options.add(new Option(namesensor, ksensor));
    sensor.options[sensor.selectedIndex].disabled = true;
  };

  var fReader = new FileReader();

  var fileInput = document.getElementById("myfile");

  function legendFormatter(data) {
    if (data.x == null) {
      // This happens when there's no selection and {legend: 'always'} is set.
      return (
        "<br>" +
        data.series
          .map(function (series) {
            return series.dashHTML + " " + series.labelHTML;
          })
          .join("<br>")
      );
    }

    var html = this.getLabels()[0] + ": " + data.xHTML;
    data.series.forEach(function (series) {
      if (!series.isVisible) return;
      var labeledData = series.labelHTML + ": " + series.yHTML;
      if (series.isHighlighted) {
        labeledData = "<b>" + labeledData + "</b>";
      }
      html += "<br>" + series.dashHTML + " " + labeledData;
    });
    return html;
  }

  const dyplot = new Dygraph(
    plotarea,
    [
      [0, 1, 1],
      [0, 1, 0],
    ],
    {
      labelsDiv: document.getElementById("legend"),
      labelsSeparateLines: true,
      //width: 640, height: 480,
      legend: "always",
      showRoller: true,
      rollPeriod: 0,
      animatedZooms: true,
      labels: ["x", "y", "y2"],
      highlightSeriesOpts: {
        strokeWidth: 2,
      },
      legendFormatter: legendFormatter,
      plugins: [
        new Dygraph.Plugins.Crosshair({
          direction: "both",
        }),
      ],
      xlabel: "time",
      ylabel: "value of sensor",
      y2label: "value of sensor",
      series: {
        y: { axis: "y" },
        y2: { axis: "y2" },
      },
      axes: {
        x: {},
        y: { drawAxis: true },
        y2: { drawAxis: true },
      },
    }
  );

  var filename = "";

  fileInput.onchange = function (e) {
    var file = this.files[0];
    filename = file.name;
    fReader.readAsText(file);
    dyplot.updateOptions({
      file: [
        [0, 1],
        [0, 1],
      ],
      title: filename,
      labels: ["x", "y"],
    });
  };

  var data = [];
  var data_plot = [];
  var labels_plot = [];
  var series_plot = {};
  fReader.onload = function (e) {
    //console.log(e.target.result); /// <-- this contains an ArrayBuffer
    var text = e.target.result;
    var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
    var starttime = lines[0].slice(0, 1 + lines[0].indexOf("M"));
    //console.log(starttime);
    //console.log(labels);
    //console.log(lines[2].trim().replace(/\s{2,}/g,' ').split(' '));

    data = [];
    const D = new Date(starttime);
    var timeoffset, linestart;
    if (isNaN(D)) {
      timeoffset = 0;
      linestart = 0;
    } else {
      timeoffset = D.getHours() + D.getMinutes() / 60;
      linestart = 1;
    }
    for (var i = linestart; i < lines.length; i++) {
      lines[i] = lines[i].trim().replace(/\s{2,}/g, " ");
    }
    var delim = guessDelimiters(lines[8] + "\n" + lines[9], [" ", "\t", ","]);
    for (var i = linestart; i < lines.length; i++) {
      var s = lines[i].split(delim[0]);
      if (isNaN(parseFloat(s[0]))) {
      } else {
        var d = [];
        s[0] = s[0] / 3600 + timeoffset;
        for (var j = 0; j < s.length; j++) {
          d.push(parseFloat(s[j]));
        }
        data.push(d);
      }
    }

    //console.log(data);
    data = transpose(data);
    //document.getElementById('clean').dispatchEvent( new Event('onclick') );
    data_plot = [];
    data_plot.push(data[0]);
    labels_plot = ["time"];
    series_plot = {};

    document.getElementById("ylist").options.length = 1;
    document.getElementById("ylist2").options.length = 1;

    var labels = lines[linestart].split(delim[0]);
    for (var i = 1; i < labels.length; i++) {
      //console.log(labels[i]);
      document.getElementById("ylist").options.add(new Option(labels[i], i));
    }
  };
});
