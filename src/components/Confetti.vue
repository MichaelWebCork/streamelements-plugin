<script>
export default {
  name: "ConfettiCanvas",
  data() {
    return {
      confetti: [],
      sequins: [],
      ctx: null,
      canvas: null,
      animationFrame: null,

      // Constants
      confettiSpeadY: 50,
      confettiSpeadX: 400,
      confettiCount: 300,
      sequinCount: 0,
      gravityConfetti: 0.3,
      gravitySequins: 0.55,
      dragConfetti: 0.075,
      dragSequins: 0.02,
      terminalVelocity: 4,
      colors: [
        { front: "#7b5cff", back: "#6245e0" }, // Purple
        { front: "#b3c7ff", back: "#8fa5e5" }, // Light Blue
        { front: "#5c86ff", back: "#345dd1" }, // Darker Blue
      ],
    };
  },
  mounted() {
    this.initializeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
    this.render();
    this.triggerConfetti(); // Initial burst on mount
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeCanvas);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  },
  methods: {
    initializeCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    randomRange(min, max) {
      return Math.random() * (max - min) + min;
    },
    initConfettoVelocity(xRange, yRange) {
      const x = this.randomRange(xRange[0], xRange[1]);
      const range = yRange[1] - yRange[0] + 1;
      let y =
        yRange[1] -
        Math.abs(
          this.randomRange(0, range) + this.randomRange(0, range) - range
        );
      if (y >= yRange[1] - 1) {
        y += Math.random() < 0.25 ? this.randomRange(1, 3) : 0;
      }
      return { x, y: -y };
    },
    createConfetto() {
      return {
        randomModifier: this.randomRange(0, 99),
        color: this.colors[Math.floor(this.randomRange(0, this.colors.length))],
        dimensions: {
          x: this.randomRange(5, 9),
          y: this.randomRange(8, 15),
        },
        position: {
          // update
          x: this.randomRange(
            this.canvas.width / 2 - this.confettiSpeadX,
            this.canvas.width / 2 + this.confettiSpeadX
          ),
          y: this.randomRange(
            this.canvas.height / 2 - this.confettiSpeadY,
            this.canvas.height / 2 + this.confettiSpeadY
          ),
        },
        rotation: this.randomRange(0, 4 * Math.PI),
        scale: { x: 1, y: 1 },
        velocity: this.initConfettoVelocity([-9, 9], [6, 11]),
      };
    },
    createSequin() {
      return {
        color:
          this.colors[Math.floor(this.randomRange(0, this.colors.length))].back,
        radius: this.randomRange(1, 2),
        position: {
          x: this.randomRange(
            this.canvas.width / 2 - 100,
            this.canvas.width / 2 + 100
          ),
          y: this.randomRange(
            this.canvas.height / 2 - 50,
            this.canvas.height / 2 + 50
          ),
        },
        velocity: {
          x: this.randomRange(-6, 6),
          y: this.randomRange(-8, -12),
        },
      };
    },
    updateConfetto(confetto) {
      confetto.velocity.x -= confetto.velocity.x * this.dragConfetti;
      confetto.velocity.y = Math.min(
        confetto.velocity.y + this.gravityConfetti,
        this.terminalVelocity
      );
      confetto.velocity.x +=
        Math.random() > 0.5 ? Math.random() : -Math.random();

      confetto.position.x += confetto.velocity.x;
      confetto.position.y += confetto.velocity.y;

      confetto.scale.y = Math.cos(
        (confetto.position.y + confetto.randomModifier) * 0.09
      );
    },
    updateSequin(sequin) {
      sequin.velocity.x -= sequin.velocity.x * this.dragSequins;
      sequin.velocity.y = sequin.velocity.y + this.gravitySequins;

      sequin.position.x += sequin.velocity.x;
      sequin.position.y += sequin.velocity.y;
    },
    triggerConfetti() {
      // Add new confetti and sequins
      for (let i = 0; i < this.confettiCount; i++) {
        this.confetti.push(this.createConfetto());
      }
      for (let i = 0; i < this.sequinCount; i++) {
        this.sequins.push(this.createSequin());
      }
    },
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        this.ctx.translate(confetto.position.x, confetto.position.y);
        this.ctx.rotate(confetto.rotation);

        this.updateConfetto(confetto);

        this.ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
        this.ctx.fillRect(-width / 2, -height / 2, width, height);

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      this.sequins.forEach((sequin, index) => {
        this.ctx.translate(sequin.position.x, sequin.position.y);
        this.updateSequin(sequin);

        this.ctx.fillStyle = sequin.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      // Remove confetti and sequins that fall off the screen
      this.confetti = this.confetti.filter(
        (confetto) => confetto.position.y < this.canvas.height
      );
      this.sequins = this.sequins.filter(
        (sequin) => sequin.position.y < this.canvas.height
      );

      this.animationFrame = window.requestAnimationFrame(this.render);
    },
  },
};
</script>

<template>
  <canvas ref="canvas" class="confetti-canvas"></canvas>
</template>

<style scoped>
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}
</style>
