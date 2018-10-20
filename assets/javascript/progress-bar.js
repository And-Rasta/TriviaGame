/*
    Creates a progress bar that ends in the center.
    Daniel Orlovsky

    See index.html for usage.
*/



function CenterProgressBar(selector, color, inc) {
    
    this.increment = inc;
    this.selector = selector;
    this.transitionSpeed = (inc * 100) + "ms";
    $(this.selector).empty();
    this.leftBarBegin = 0;
    this.rightBarBegin = 100;
    this.progressWrapper = $("<div id='progress-wrapper'></div>");
    this.leftWrapper = $("<div id='left-wrapper'></div>");
    this.rightWrapper = $("<div id='right-wrapper'></div>");
    this.progressWrapper.css({
        width: "100%",
        height: "100%",
    })
    this.progressWrapper.append(this.leftWrapper).append(this.rightWrapper);
    this.leftWrapper.css( {
        "overflow": "hidden",
        background: color,
        float: "left",
        width: "50%",
        height: "100%",
    });
    this.leftProgress = $("<div id='left-progress'></div>");
    this.rightWrapper.css({
        float: "right",
        background: $(selector).css("background"),
        width: "50%",
        height: "100%",   
    });
    this.rightProgress = $("<div id='right-progress'></div>");
    this.rightProgress.css({
        background: color,
        "transition": "width " + this.transitionSpeed,
        height: "100%",
    });
    this.rightWrapper.append(this.rightProgress);
    
    this.leftProgress.css({
        background: $(this.selector).css("background-color"),
        "transition": "width " + this.transitionSpeed,
        height: "100%",
    });
    this.leftProgress.css("width", this.leftBarBegin + "%");
    this.rightProgress.css("width", this.rightBarBegin + "%");
    this.leftWrapper.append(this.leftProgress);
    $(this.selector).append(this.progressWrapper);
    
}

CenterProgressBar.prototype = {
    advanceProgressBar: function(callback) {
        this.leftBarBegin += this.increment;
        this.rightBarBegin -= this.increment;
        this.leftProgress.css("width", this.leftBarBegin + "%");
        this.rightProgress.css("width", this.rightBarBegin + "%");
        if(this.leftBarBegin >= 100 && this.rightBarBegin <= 0) {
            if(!callback) {
                return;
            } 
            callback();
        }   
    },
}