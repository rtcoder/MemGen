String.prototype.lines = function () {
    return this.split(/\r*\n/);
}
String.prototype.lineCount = function () {
    return this.lines().length;
}
var keys = {
    Ctrl: false, //press Control (Ctrl)
    delete: false, //press delete
    O: false,
    I: false,
    S: false
}
var canvas,
        ctx,
        MemGen = {
            color: '#fff',
            strokeColor: '#000',
            fontSize: 20,
            fontStyle: "Tahoma",
            isStroke: true,
            image: new Image(),
            strokeWidth: 5,
            fitToFrame: false,
            init: function () {
                canvas = document.getElementById("myCanvas");
                ctx = canvas.getContext("2d");
                MemGen.initEvents();
            },
            resize: function () {
            },
            drawText: function () {
                ctx.strokeStyle = MemGen.strokeColor;
                ctx.fillStyle = MemGen.color;
                ctx.font = MemGen.fontSize + "px " + MemGen.fontStyle;

                ctx.textAlign = "center";
                MemGen.putTopText($('textarea#top-text').val());
                MemGen.putBottomText($('textarea#bottom-text').val());
            },
            putTopText: function (text) {
                var lines = text.lines();
                var lineCount = text.lineCount();
                var maxWidth = canvas.width - 50;
                var lineHeight = MemGen.fontSize;
                var y = MemGen.fontSize + 10;
                for (var i = 0; i < lineCount; i++) {

                    if (MemGen.isStroke) {
                        MemGen.drawStroked(lines[i], canvas.width / 2, (i + 1) * y);
                    }
                    ctx.fillText(lines[i], canvas.width / 2, (i + 1) * y);
                }
            },
            putBottomText: function (text) {
                var lines = text.lines();
                var lineCount = text.lineCount();
                var maxWidth = canvas.width - 50;
                var lineHeight = MemGen.fontSize;
                var y = MemGen.fontSize + 10;
                for (var i = 0; i < lineCount; i++) {

                    if (MemGen.isStroke) {
                        MemGen.drawStroked(lines[i], canvas.width / 2, canvas.height - ((lineCount - (i)) * y));
                    }
                    ctx.fillText(lines[i], canvas.width / 2, canvas.height - ((lineCount - (i)) * y));
                }
            },
            drawStroked: function (text, x, y) {
                ctx.lineWidth = MemGen.strokeWidth;
                ctx.strokeText(text, x, y);
            },
            drawAll: function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                MemGen.drawImage();
                MemGen.drawText();

            },
            drawImage: function () {
                if (MemGen.fitToFrame) {
                    ctx.drawImage(MemGen.image, 0, 0, canvas.width, canvas.height);
                } else {
                    ctx.drawImage(MemGen.image, 0, 0);
                }
            },
            upload: function (event) {
                var input = event.target;
                var widthImg;
                var heightImg;
                MemGen.image = new Image();

                MemGen.image.src = URL.createObjectURL(input.files[0]);

                MemGen.image.onload = function () {
                    widthImg = this.width;
                    heightImg = this.height;

                    MemGen.drawAll();
                }
            },
            download: function () {
                canvas.toBlob(function (blob) {
                    saveAs(blob, "meme.png");
                });

            },
            exportLink:function(){
                var src = canvas.toDataURL();
                window.open(src,'_blank');
            },
            initEvents: function () {
                $('textarea').keyup(function () {
                    MemGen.drawAll();
                });

                $('input#stroke').change(function () {
                    MemGen.isStroke = $(this).is(":checked");
                    MemGen.drawAll();
                });
                $('input#fitToFrame').change(function () {
                    MemGen.fitToFrame = $(this).is(":checked");
                    MemGen.drawAll();
                });

                $('input#color').change(function () {
                    MemGen.color = $(this).val();
                    MemGen.drawAll();
                });

                $('input#strokeColor').change(function () {
                    MemGen.strokeColor = $(this).val();
                    MemGen.drawAll();
                });

                $('input#lineWidth').change(function () {
                    MemGen.strokeWidth = parseInt($(this).val());
                    MemGen.drawAll();
                }).mousemove(function () {
                    MemGen.strokeWidth = parseInt($(this).val());
                    MemGen.drawAll();
                }).val(MemGen.strokeWidth)
                        .parent().find('label').find('span.val').text(MemGen.strokeWidth);

                $('input#fontSize').change(function () {
                    MemGen.fontSize = parseInt($(this).val());
                    MemGen.drawAll();
                }).mousemove(function () {
                    MemGen.fontSize = parseInt($(this).val());
                    MemGen.drawAll();
                }).val(MemGen.fontSize)
                        .parent().find('label').find('span.val').text(MemGen.fontSize);
                
                
                $('input#frameX').change(function () {
                    $('canvas').attr('width', parseInt($(this).val()))
                    MemGen.drawAll();
                }).mousemove(function () {
                    $('canvas').attr('width', parseInt($(this).val()))
                    MemGen.drawAll();
                });

                $('input#frameY').change(function () {
                    $('canvas').attr('height', parseInt($(this).val()))
                    MemGen.drawAll();
                }).mousemove(function () {
                    $('canvas').attr('height', parseInt($(this).val()))
                    MemGen.drawAll();
                });

                $('input[type=range]').change(function () {
                    $(this).parent().find('label').find('span.val').text($(this).val());

                    if ($(this).attr('id') === 'frameX') {
                        $('span#valX').text($(this).val())
                    }
                    if ($(this).attr('id') === 'frameY') {
                        $('span#valY').text($(this).val())
                    }
                }).mousemove(function () {
                    $(this).parent().find('label').find('span.val').text($(this).val());

                    if ($(this).attr('id') === 'frameX') {
                        $('span#valX').text($(this).val())
                    }
                    if ($(this).attr('id') === 'frameY') {
                        $('span#valY').text($(this).val())
                    }
                });
                $('select').change(function () {
                    MemGen.fontStyle = $(this).val();
                    MemGen.drawAll();
                });
                $('select option').each(function () {
                    $(this).css('font-family', $(this).attr('value'))
                });
                
                $('#upload').click(function () {
                    $('input#image-upload').click();
                })
            }
        };
$(document).ready(function () {
    MemGen.init();
}).keydown(function (event) {
    if (!$('textarea').is(':focus')) {
        event.preventDefault();
    }

    switch (event.keyCode) {
        case 17 :
            keys.Ctrl = true;
            break;
        case 46 :
            keys.delete = true;
            break;
        case 73 :
            keys.I = true;
            break;
        case 79 :
            keys.O = true;
            break;
        case 83 :
            keys.S = true;
            break;
    }
    if (keys.delete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (keys.I) {
        if (keys.Ctrl) {
            $("#info").toggle();
        }
    }
    if (keys.O) {
        if (keys.Ctrl) {
            $("#image-upload").click();
        }
    }
    if (keys.S) {
        if (keys.Ctrl) {
            MemGen.download()
        }
    }

}).keyup(function (event) {
    switch (event.keyCode) {
        case 17 :
            keys.Ctrl = false;
            break;
        case 46 :
            keys.delete = false;
            break;
        case 73 :
            keys.I = false;
            break;
        case 79 :
            keys.O = false;
            break;
        case 83 :
            keys.S = false;
            break;
    }
})
