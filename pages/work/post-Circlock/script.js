function Circlock(element, option) {
    const canvas = element.getContext('2d');
    const canvasWidth = option.canvasWidth || 512;
    const canvasHeight = option.canvasHeight || 512;
    const colorHueStart = option.colorHueStart || 0;
    const colorHueEnd = option.colorHueEnd || 1;
    const topColor = option.topColor || 'hsl(<hue>, 100%, 75%, 100%)';
    const bodyColor = option.bodyColor || 'hsl(<hue>, 50%, 25%, 100%)';
    const backgroundColor = option.backgroundColor || 'hsl(<hue>, 25%, 50%, 25%)';

    const d2r = (angle) => (angle / 360) * 2 * Math.PI;
    const p2d = (ratio) => ratio * 360;

    const getEndOfMonth = (date) => {
        const buf = new Date(date);

        buf.setMonth(date.getMonth() + 1, 0);

        return buf.getDate();
    };

    const dayText = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const calcUtilValue = (option) => {
        option.startAngle = d2r(-90);
        option.endAngle = option.startAngle + d2r(option.angle);

        option.canvasCenter = {
            x: option.contentWidth / 2,
            y: option.contentHeight / 2,
        };

        option.arcPoint = {
            startX: (Math.cos(option.startAngle) + 1) / 2,
            startY: (Math.sin(option.startAngle) + 1) / 2,
            endX: (Math.cos(option.endAngle) + 1) / 2,
            endY: (Math.sin(option.endAngle) + 1) / 2,
        };

        option.canvasArcPoint = {
            startX: option.contentWidth / 2 - option.radius + option.arcPoint.startX * 2 * option.radius,
            startY: option.contentHeight / 2 - option.radius + option.arcPoint.startY * 2 * option.radius,
            endX: option.contentWidth / 2 - option.radius + option.arcPoint.endX * 2 * option.radius,
            endY: option.contentHeight / 2 - option.radius + option.arcPoint.endY * 2 * option.radius,
        };
    };

    const drawClockBody = (option) => {
        option.content.fillStyle = option.backgroundColor;

        {
            option.content.beginPath();
            option.content.arc(option.canvasCenter.x, option.canvasCenter.y, option.radius + option.weight / 2, d2r(0), d2r(360));
            option.content.arc(option.canvasCenter.x, option.canvasCenter.y, option.radius - option.weight / 2, d2r(360), d2r(0), true);
            option.content.fill();
            option.content.closePath();
        }

        option.content.fillStyle = option.bodyColor;

        {
            option.content.beginPath();
            option.content.arc(option.canvasCenter.x, option.canvasCenter.y, option.radius + option.weight / 2, option.startAngle, option.endAngle);
            option.content.arc(option.canvasCenter.x, option.canvasCenter.y, option.radius - option.weight / 2, option.endAngle, option.startAngle, true);
            option.content.fill();
            option.content.closePath();
        }

        {
            option.content.beginPath();
            option.content.arc(option.canvasArcPoint.startX, option.canvasArcPoint.startY, option.weight / 2, d2r(0), d2r(360));
            option.content.fill();
            option.content.closePath();
        }

        option.content.fillStyle = option.topColor;

        {
            option.content.beginPath();
            option.content.arc(option.canvasArcPoint.endX, option.canvasArcPoint.endY, option.weight / 2, d2r(0), d2r(360));
            option.content.fill();
            option.content.closePath();
        }
    };

    const drawClockLabel = (option) => {
        option.content.fillStyle = option.topColor;
        option.content.font = `${option.weight / 2}px courier`;

        const dialMeasure = option.content.measureText(option.label);
        const dialWidth = dialMeasure.width;
        const dialHeight = dialMeasure.actualBoundingBoxAscent + dialMeasure.actualBoundingBoxDescent;

        option.content.fillText(option.label, option.canvasCenter.x - dialWidth / 2, option.contentHeight / 2 - option.radius + dialHeight / 2);
    };

    const drawClockDial = (option) => {
        option.content.fillStyle = option.bodyColor;
        option.content.font = `${option.weight / 2}px courier`;

        option.content.save();
        option.content.translate(option.canvasArcPoint.endX, option.canvasArcPoint.endY);
        option.content.rotate(d2r(option.angle));

        const dialMeasure = option.content.measureText(option.dial);
        const dialWidth = dialMeasure.width;
        const dialHeight = dialMeasure.actualBoundingBoxAscent + dialMeasure.actualBoundingBoxDescent;

        option.content.fillText(option.dial, (dialWidth / 2) * -1, dialHeight / 2);
        option.content.restore();
    };

    this.draw = () => {
        canvas.clearRect(0, 0, canvasWidth, canvasHeight);

        const drawList = [
            { angle: moment.rate.year, dial: String(parseInt(moment.original.year) % 1000), label: 'Yr' },
            { angle: moment.rate.month, dial: String(parseInt(moment.original.month) + 1), label: 'Mh' },
            { angle: moment.rate.day, dial: dayText[parseInt(moment.original.day)], label: 'Dy' },
            { angle: moment.rate.date, dial: String(parseInt(moment.original.date)), label: 'De' },
            { angle: moment.rate.hours, dial: String(parseInt(moment.original.hours)), label: 'Hr' },
            { angle: moment.rate.minutes, dial: String(parseInt(moment.original.minutes)), label: 'Me' },
            { angle: moment.rate.seconds, dial: String(parseInt(moment.original.seconds)), label: 'Sd' },
            { angle: moment.rate.milliseconds, dial: '.' + String(parseInt(moment.original.milliseconds / 100)), label: 'Md' },
        ];

        const arcWeight = canvasHeight / 2 / (drawList.length + 1) - 8;

        drawList.map((item, index) => {
            const hue = p2d(colorHueStart + (index / drawList.length) * (colorHueEnd - colorHueStart));

            const option = {
                content: canvas,
                contentWidth: canvasWidth,
                contentHeight: canvasHeight,
                radius: ((drawList.length - index) / drawList.length) * (canvasHeight / 2 - arcWeight),
                weight: arcWeight,
                angle: p2d(item.angle),
                dial: item.dial,
                label: item.label,
                topColor: topColor.replace('<hue>', String(hue)),
                bodyColor: bodyColor.replace('<hue>', String(hue)),
                backgroundColor: backgroundColor.replace('<hue>', String(hue)),
            };

            calcUtilValue(option);
            drawClockBody(option);
            drawClockLabel(option);
            drawClockDial(option);
        });
    };

    let date;

    let moment = {
        original: {
            year: 0,
            month: 0,
            day: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        },
        rate: {
            year: 0,
            month: 0,
            day: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        },
    };

    this.update = () => {
        date = new Date();

        moment.original.milliseconds = date.getMilliseconds();
        moment.original.seconds = date.getSeconds() + moment.original.milliseconds / 1000;
        moment.original.minutes = date.getMinutes() + moment.original.seconds / 60;
        moment.original.hours = date.getHours() + moment.original.minutes / 60;
        moment.original.date = date.getDate() + moment.original.hours / 24;
        moment.original.day = date.getDay() + moment.original.hours / 24;
        moment.original.month = date.getMonth() + moment.original.date / getEndOfMonth(date);
        moment.original.year = date.getFullYear() + moment.original.month / 12;

        moment.rate.milliseconds = moment.original.milliseconds / 1000;
        moment.rate.seconds = moment.original.seconds / 60;
        moment.rate.minutes = moment.original.minutes / 60;
        moment.rate.hours = moment.original.hours / 24;
        moment.rate.date = moment.original.date / getEndOfMonth(date);
        moment.rate.day = moment.original.day / 7;
        moment.rate.month = moment.original.month / 12;
        moment.rate.year = (moment.original.year % 10) / 10;
    };
}
