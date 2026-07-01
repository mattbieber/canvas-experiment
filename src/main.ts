import './style.css'

class FlowFieldEffect {
    #ctx: CanvasRenderingContext2D
    #width: number
    #height: number
    lastTime: number
    interval: number
    timer: number = 0
    cellSize: number
    gradient: CanvasGradient
    a: number = 30
    zoom: number = 0.005
    radius: number = 0
    vr: number = 0.001
    playing: boolean = false

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.#ctx = ctx
        this.#width = width
        this.#height = height
        this.#ctx.lineWidth = 0.5
        this.cellSize = 15
        this.lastTime = 0
        this.interval = 1000 / 60
        this.timer = 0
        this.gradient = this.#ctx.createLinearGradient(
            0,
            0,
            this.#width,
            this.#height,
        )
        this.#createGradient()
        this.#ctx.strokeStyle = this.gradient
    }

    #drawLine(angle: number, x: number, y: number) {
        let positionX = x
        let positionY = y
        let dx = mouse.x - positionX
        let dy = mouse.y - positionY
        let distance = dx * dx + dy * dy
        if (distance > 600000) distance = 600000
        else if (distance < 50000) distance = 50000
        let length = distance * 0.005
  
        this.#ctx.beginPath()
        this.#ctx.moveTo(x, y)
        this.#ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length,
        )
        this.#ctx.stroke()
    }

    #createGradient() {
        this.gradient.addColorStop(0.1, '#ff5c33')
        this.gradient.addColorStop(0.2, '#ff66b3')
        this.gradient.addColorStop(0.4, '#ccccff')
        this.gradient.addColorStop(0.6, '#b3ffff')
        this.gradient.addColorStop(0.8, '#80ff80')
        this.gradient.addColorStop(0.9, '#ffff33')
    }

    animate(timeStamp: number) {
        const deltaTime = timeStamp - this.lastTime
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height)
            this.radius += this.vr
            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle =
                        (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) *
                        this.radius
                    this.#drawLine(angle, x, y)
                }
            }
            this.timer = 0
        } else {
            this.timer += deltaTime
        }

        if (this.playing) {
            requestAnimationFrame(this.animate.bind(this))
        }
    }
}


let flowField: FlowFieldEffect  

window.onload = function () {
    const canvas = document.getElementById('canvas1') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    if (ctx) {
        flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
        
    }
    
}

const mouse = {
    x: 0,
    y: 0,
}


window.addEventListener('mousedown', function (e: MouseEvent) {
        flowField.playing = !flowField.playing
        if (flowField.playing) {
          flowField.animate(0)
        }
    })

window.addEventListener('mousemove', function (e: MouseEvent) {
    mouse.x = e.x
    mouse.y = e.y
})

window.addEventListener('resize', function () {
    const canvas = document.getElementById('canvas1') as HTMLCanvasElement
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
})
