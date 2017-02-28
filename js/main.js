String.prototype.lines = function () {
    return this.split(/\r*\n/);
}
String.prototype.lineCount = function () {
    return this.lines().length;
}

var canvas,
        ctx,
        MemGen = {
            color: '#fff',
            strokeColor: '#000',
            fontSize: 20,
            fontStyle: "Tahoma",
            isStroke: true,
            image: null,
            strokeWidth: 5,
            init: function () {
                MemGen.initEvents();
                canvas = document.getElementById("myCanvas");
                ctx = canvas.getContext("2d");
                MemGen.initEvents();
            },
            drawText: function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                if (MemGen.isStroke) {
                    MemGen.drawStroked(text, canvas.width / 2, canvas.height - 50);
                }
                ctx.fillText(text, canvas.width / 2, canvas.height - 50);
            },
            drawStroked: function (text, x, y) {
                ctx.lineWidth = MemGen.strokeWidth;
                ctx.strokeText(text, x, y);
            },
            drawImage: function(){
                ctx.drawImage(MemGen.image, 0, 0, canvas.width, canvas.height);
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

                    MemGen.drawImage();
                }
            },
            download: function () {
                $(webDraft.draw.selectorId).append('<canvas id="tmpCanvas" width="' + webDraft.draw.width + '" height="' + webDraft.draw.height + '"></canvas>');

                var temp_c = document.getElementById("tmpCanvas");
                var temp_ctx = temp_c.getContext("2d");

                for (var i = 0; i <= layers.list.id.length; i++) {
                    if (typeof layers.list.id[i] === "string" && layers.list.visible[i] === true) {
                        var imgData = document.getElementById(layers.list.id[i]);
                        var top = parseInt($("#" + layers.list.id[i]).css("top"));
                        var left = parseInt($("#" + layers.list.id[i]).css("left"));
                        temp_ctx.drawImage(imgData, top, left);
                    }
                }

                $("#tmpCanvas").width(webDraft.draw.width).height(webDraft.draw.height)
                temp_c.toBlob(function (blob) {
                    saveAs(blob, "plik.png");
                });

                $("#tmpCanvas").remove();
            },
            initEvents: function () {
                $('textarea').keyup(function () {
                    MemGen.drawText();
                });

                $('input#stroke').change(function () {
                    MemGen.isStroke = $(this).is(":checked");
                    MemGen.drawText();
                });

                $('input#color').change(function () {
                    MemGen.color = $(this).val();
                    MemGen.drawText();
                });

                $('input#strokeColor').change(function () {
                    MemGen.strokeColor = $(this).val();
                    MemGen.drawText();
                });

                $('input#lineWidth').change(function () {
                    MemGen.strokeWidth = parseInt($(this).val());
                    MemGen.drawText();
                }).mousemove(function () {
                    MemGen.strokeWidth = parseInt($(this).val());
                    MemGen.drawText();
                }).val(MemGen.strokeWidth);

                $('input#fontSize').change(function () {
                    MemGen.fontSize = parseInt($(this).val());
                    MemGen.drawText();
                }).mousemove(function () {
                    MemGen.fontSize = parseInt($(this).val());
                    MemGen.drawText();
                }).val(MemGen.fontSize);

                $('select').change(function () {
                    MemGen.fontStyle = $(this).val();
                    MemGen.drawText();
                });
                $('select option').each(function () {
                    $(this).css('font-family', $(this).attr('value'))
                })
            }
        };
$(document).ready(function () {
    MemGen.init();
});
