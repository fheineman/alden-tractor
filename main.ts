function goBackward () {
    pins.digitalWritePin(DigitalPin.P8, 1)
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 0)
    pins.analogWritePin(AnalogPin.P1, speed)
}
function goForward () {
    pins.digitalWritePin(DigitalPin.P8, 1)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 1)
    pins.analogWritePin(AnalogPin.P1, speed)
}
input.onButtonPressed(Button.A, function () {
    music.playMelody("C C D D D D C C ", 480)
})
radio.onReceivedValue(function (name, value) {
    if (name == "joyH") {
        joyH = value
    } else if (name == "joyV") {
        joyV = value
    }
})
function Stop () {
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    pins.analogWritePin(AnalogPin.P1, speed / 2)
    pins.digitalWritePin(DigitalPin.P8, 0)
}
let seatSwitch = 0
let enableRC = 0
let enableAdult = 0
let footPedal2 = 0
let footPedal1 = 0
let speed = 0
let joyV = 0
let joyH = 0
led.enable(false)
Stop()
pins.analogSetPeriod(AnalogPin.P1, 20000)
pins.setPull(DigitalPin.P7, PinPullMode.PullUp)
pins.setPull(DigitalPin.P9, PinPullMode.PullDown)
pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
let direction = 1
radio.setGroup(1)
joyH = 512
joyV = 512
music.playMelody("C E G C5 - G C5 C5 ", 360)
music.playTone(523, music.beat(BeatFraction.Breve))
music.setTempo(120)
music.setBuiltInSpeakerEnabled(true)
basic.forever(function () {
    if (direction == 0) {
        music.playTone(988, music.beat(BeatFraction.Whole))
        music.rest(music.beat(BeatFraction.Whole))
    }
})
basic.forever(function () {
    footPedal1 = Math.map(pins.analogReadPin(AnalogPin.P3), 250, 790, 0, 1023)
    footPedal2 = Math.map(pins.analogReadPin(AnalogPin.P10), 250, 790, 0, 1023)
    enableAdult = pins.digitalReadPin(DigitalPin.P7) + 1
    enableRC = pins.digitalReadPin(DigitalPin.P9)
    direction = pins.digitalReadPin(DigitalPin.P15)
    seatSwitch = pins.digitalReadPin(DigitalPin.P16)
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P15) != direction && footPedal1 < 50) {
        direction = pins.digitalReadPin(DigitalPin.P15)
    }
})
basic.forever(function () {
    if (seatSwitch == 0) {
        if (enableRC == 1 && joyV > 550) {
            speed = Math.map(joyV, 550, 1023, 10, 1023)
            goForward()
        } else if (enableRC == 1 && joyV < 450) {
            speed = Math.map(joyV, 0, 450, 1023, 10)
            goBackward()
        } else {
            speed = 0
            pins.analogWritePin(AnalogPin.P1, speed)
            pins.digitalWritePin(DigitalPin.P8, 0)
        }
    } else {
        if (direction == 1) {
            if (footPedal1 > 50 && seatSwitch == 1) {
                speed = footPedal1
                goForward()
            } else if (enableAdult == 1 && footPedal2 > 50 && seatSwitch == 1) {
                speed = footPedal2
                goForward()
            } else {
                Stop()
            }
        } else {
            if (footPedal1 > 50 && seatSwitch == 1) {
                speed = footPedal1
                goBackward()
            } else if (enableAdult == 1 && footPedal2 > 50 && seatSwitch == 1) {
                speed = footPedal2
                goBackward()
            } else {
                Stop()
            }
        }
    }
})
