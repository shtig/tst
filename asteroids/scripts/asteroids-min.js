/* Copyright (c) 2011  All Rights Reserved - Kevin Roast http://www.kevs3d.co.uk/ */
var BITMAPS = true;
var GLOWEFFECT = true;
var TESTLENGTH = 8000;
var g_asteroidImg1 = new Image();
var g_asteroidImg2 = new Image();
var g_asteroidImg3 = new Image();
var g_asteroidImg4 = new Image();
var g_shieldImg = new Image();
var g_backgroundImg = new Image();
var g_playerImg = new Image();
var g_enemyshipImg = new Image();

function onloadHandler() {
    g_backgroundImg.src = "images/bg3.jpg";
    g_backgroundImg.onload = function () {
        GameHandler.init();
        GameHandler.start(new Asteroids.Main())
    }
}

if (typeof Asteroids == "undefined" || !Asteroids) {
    var Asteroids = {}
}
(function () {
    Asteroids.Main = function () {
        Asteroids.Main.superclass.constructor.call(this);
        var e = new Asteroids.InfoScene(this);
        var d = new Game.Preloader();
        d.addImage(g_playerImg, "images/player.png");
        d.addImage(g_asteroidImg1, "images/asteroid1.png");
        d.addImage(g_asteroidImg2, "images/asteroid2.png");
        d.addImage(g_asteroidImg3, "images/asteroid3.png");
        d.addImage(g_asteroidImg4, "images/asteroid4.png");
        d.addImage(g_enemyshipImg, "images/enemyship1.png");
        d.onLoadCallback(function () {
            e.ready()
        });
        this.player = new Asteroids.Player(new Vector(GameHandler.width / 2, GameHandler.height / 2), new Vector(0, 0), 0);
        this.scenes.push(e);
        for (var j, f = 0; f < 6; f++) {
            j = new Asteroids.BenchMarkScene(this, f + 1);
            this.scenes.push(j)
        }
        this.scenes.push(new Asteroids.CompletedScene(this));
        for (var g, f = 0; f < this.STARFIELD_SIZE; f++) {
            g = new Asteroids.Star();
            g.init();
            this.starfield.push(g)
        }
        this.fps = 33
    };
    extend(Asteroids.Main, Game.Main, {
        STARFIELD_SIZE: 32,
        player: null,
        lives: 3,
        backgroundX: 0,
        starfield: [],
        onRenderGame: function b(d) {
            if (BITMAPS) {
                d.drawImage(g_backgroundImg, this.backgroundX++, 0, GameHandler.width, GameHandler.height, 0, 0, GameHandler.width, GameHandler.height);
                if (this.backgroundX == (g_backgroundImg.width / 2)) {
                    this.backgroundX = 0
                }
                d.shadowBlur = 0
            } else {
                d.fillStyle = "black";
                d.fillRect(0, 0, GameHandler.width, GameHandler.height);
                d.shadowBlur = GLOWEFFECT ? 8 : 0;
                this.updateStarfield(d)
            }
        },
        isGameOver: function c() {
            return false
        },
        updateStarfield: function a(d) {
            for (var g, f = 0, e = this.starfield.length; f < e; f++) {
                g = this.starfield[f];
                g.render(d);
                g.z -= g.VELOCITY * 0.1;
                if (g.z < 0.1 || g.prevx > GameHandler.height || g.prevy > GameHandler.width) {
                    g.init()
                }
            }
        }
    })
})();
(function () {
    Asteroids.InfoScene = function (f) {
        this.game = f;
        Asteroids.InfoScene.superclass.constructor.call(this, false, null)
    };
    extend(Asteroids.InfoScene, Game.Scene, {
        game: null, start: false, imagesLoaded: false, isComplete: function e() {
            return this.start
        }, onInitScene: function b() {
            this.start = false
        }, onRenderScene: function a(f) {
            if (this.imagesLoaded) {
                Game.centerFillText(f, "Press SPACE to run Asteroids HTML5 Canvas Benchmark", "14pt Courier New", GameHandler.height / 2, "white")
            } else {
                Game.centerFillText(f, "Please wait... Loading Images...", "14pt Courier New", GameHandler.height / 2, "white")
            }
        }, ready: function c() {
            this.imagesLoaded = true
        }, onKeyDownHandler: function d(f) {
            switch (f) {
                case KEY.SPACE:
                    if (this.imagesLoaded) {
                        this.start = true
                    }
                    return true;
                    break
            }
        }
    })
})();
(function () {
    Asteroids.CompletedScene = function (f) {
        this.game = f;
        var e = new Game.Interval("Benchmark Completed!", this.intervalRenderer);
        Asteroids.CompletedScene.superclass.constructor.call(this, false, e)
    };
    extend(Asteroids.CompletedScene, Game.Scene, {
        game: null, exit: false, onInitScene: function a() {
            this.game.fps = 33;
            this.interval.reset();
            this.exit = false
        }, isComplete: function d() {
            return true
        }, intervalRenderer: function b(g, f) {
            var k = Math.ceil(this.game.benchmarkFrameCount / (TESTLENGTH * 6 / 1000));
            var m = this.game.benchmarkFrameCount;
            if (g.framecounter === 0) {
                var j, i = "Unknown";
                var e = navigator.userAgent;
                if ((j = e.indexOf("Chrome/")) !== -1) {
                    i = e.substr(j, 10)
                } else {
                    if ((j = e.indexOf("Safari/")) !== -1) {
                        i = e.substr(j, 8)
                    } else {
                        if ((j = e.indexOf("Firefox/")) !== -1) {
                            i = e.substr(j, 11)
                        } else {
                            if ((j = e.indexOf("Opera/")) !== -1) {
                                i = e.substr(j, 9)
                            } else {
                                if ((j = e.indexOf("MSIE ")) !== -1) {
                                    i = e.substr(j, 8)
                                }
                            }
                        }
                    }
                }
                $("#results").html("<p>Benchmark Score: " + this.game.benchmarkFrameCount + "<br>Average FPS: " + k + "</p>");
                var l = "http://twitter.com/home/?status=My%20" + i + "%20browser%20scored:%20" + m + "%20-%20in%20the%20Asteroids%20HTML5%20Canvas%20benchmark!%20http://bit.ly/astbench%20(by%20@kevinroast)%20%23JavaScript%20%23html5";
                $("#tweetlink").attr("href", l);
                $("#results-wrapper").fadeIn()
            }
            Game.centerFillText(f, g.label, "18pt Courier New", GameHandler.height / 2 - 32, "white");
            Game.centerFillText(f, "Benchmark Score: " + m, "14pt Courier New", GameHandler.height / 2, "white");
            Game.centerFillText(f, "Average FPS: " + k, "14pt Courier New", GameHandler.height / 2 + 24, "white");
            g.complete = (this.exit || g.framecounter++ > 500)
        }, onKeyDownHandler: function c(e) {
            switch (e) {
                case KEY.SPACE:
                    this.exit = true;
                    return true;
                    break
            }
        }
    })
})();
(function () {
    Asteroids.BenchMarkScene = function (game, test) {
        this.game = game;
        this.test = test;
        this.player = game.player;
        var interval = new Game.Interval("Test " + test, this.intervalRenderer);
        Asteroids.BenchMarkScene.superclass.constructor.call(this, true, interval)
    };
    extend(Asteroids.BenchMarkScene, Game.Scene, {
        game: null,
        test: 0,
        player: null,
        actors: null,
        playerBullets: null,
        enemies: null,
        enemyBullets: null,
        effects: null,
        sceneStartTime: null,
        testState: 0,
        onInitScene: function onInitScene() {
            this.game.fps = 120;
            this.actors = [];
            this.enemies = [];
            this.actors.push(this.enemies);
            this.actors.push(this.playerBullets = []);
            this.actors.push(this.enemyBullets = []);
            this.actors.push(this.effects = []);
            this.actors.push([this.player]);
            with (this.player) {
                position.x = GameHandler.width / 2;
                position.y = GameHandler.height / 2;
                vector.x = 0;
                vector.y = 0;
                heading = 0
            }
            this.testState = 0;
            if (this.test >= 1 && this.test <= 3) {
                for (var i = 0; i < 200; i++) {
                    this.enemies.push(this.generateAsteroid(1, Math.floor(i / 50) + 1))
                }
            } else {
                if (this.test === 4) {
                    for (var i = 0; i < 200; i++) {
                        this.enemies.push(new Asteroids.EnemyShip(this, Math.floor(i / 100)))
                    }
                } else {
                    if (this.test === 6) {
                        var vec = new Vector(0, 0);
                        for (var i = 0; i < 200; i++) {
                            var e = this.generateAsteroid(1, Math.floor(i / 50) + 1);
                            this.destroyEnemy(e, vec)
                        }
                    }
                }
            }
            BITMAPS = !(this.test === 2 || this.test === 3);
            GLOWEFFECT = (this.test === 3);
            this.interval.reset();
            this.sceneStartTime = new Date().getTime()
        },
        onBeforeRenderScene: function onBeforeRenderScene() {
            this.updateActors()
        },
        onRenderScene: function onRenderScene(ctx) {
            if (this.test === 5) {
                if (new Date().getTime() - this.sceneStartTime > this.testState) {
                    this.testState += 25;
                    for (var i = 0; i < 2; i++) {
                        h = this.player.heading - 15;
                        t = new Vector(0, -7).rotate(h * RAD).add(this.player.vector);
                        this.playerBullets.push(new Asteroids.Bullet(this.player.position.clone(), t, h));
                        h = this.player.heading;
                        t = new Vector(0, -7).rotate(h * RAD).add(this.player.vector);
                        this.playerBullets.push(new Asteroids.Bullet(this.player.position.clone(), t, h));
                        h = this.player.heading + 15;
                        t = new Vector(0, -7).rotate(h * RAD).add(this.player.vector);
                        this.playerBullets.push(new Asteroids.Bullet(this.player.position.clone(), t, h));
                        t = new Vector(0, -8);
                        h = this.player.heading + 180;
                        t.rotate(h * RAD);
                        t.add(this.player.vector);
                        this.playerBullets.push(new Asteroids.Bullet(this.player.position.clone(), t, h, 25));
                        h = this.player.heading - 90;
                        t = new Vector(0, -8).rotate(h * RAD).add(this.player.vector);
                        this.playerBullets.push(new Asteroids.Bullet(this.player.position.clone(), t, h, 25));
                        h = this.player.heading + 90;
                        t = new Vector(0, -8).rotate(h * RAD).add(this.player.vector);
                        this.playerBullets.push(new Asteroids.Bullet(this.player.position.clone(), t, h, 25))
                    }
                    this.player.heading += 8
                }
            }
            if (this.test === 6 && ((this.testState === 0 && (new Date().getTime() - this.sceneStartTime > 2000)) || (this.testState === 1 && (new Date().getTime() - this.sceneStartTime > 4000)))) {
                var vec = new Vector(0, 0);
                for (var i = 0, j = this.enemies.length; i < j; i++) {
                    this.destroyEnemy(this.enemies[i], vec)
                }
                this.enemies.splice(0, 100);
                this.testState++
            }
            this.renderActors(ctx);
            this.renderOverlay(ctx)
        },
        isComplete: function isComplete() {
            return (new Date().getTime() - this.sceneStartTime > TESTLENGTH)
        },
        intervalRenderer: function intervalRenderer(interval, ctx) {
            if (interval.framecounter++ < 50) {
                Game.centerFillText(ctx, interval.label, "18pt Courier New", GameHandler.height / 2 - 8, "white")
            } else {
                interval.complete = true
            }
        },
        onKeyDownHandler: function onKeyDownHandler(keyCode) {
            switch (keyCode) {
                case KEY.ESC:
                    GameHandler.pause();
                    return true;
                    break
            }
        },
        generateAsteroid: function generateAsteroid(speedFactor, size) {
            while (true) {
                var apos = new Vector(Math.random() * GameHandler.width, Math.random() * GameHandler.height);
                if (this.player.position.distance(apos) > 125) {
                    var vec = new Vector(((Math.random() * 2) - 1) * speedFactor, ((Math.random() * 2) - 1) * speedFactor);
                    var asteroid = new Asteroids.Asteroid(apos, vec, size ? size : 4);
                    return asteroid
                }
            }
        },
        updateActors: function updateActors() {
            for (var i = 0, j = this.actors.length; i < j; i++) {
                var actorList = this.actors[i];
                for (var n = 0; n < actorList.length; n++) {
                    var actor = actorList[n];
                    actor.onUpdate(this);
                    if (actor.expired()) {
                        actorList.splice(n, 1)
                    } else {
                        actor.position.add(actor.vector);
                        if (actor.position.x >= GameHandler.width) {
                            actor.position.x = 0
                        } else {
                            if (actor.position.x < 0) {
                                actor.position.x = GameHandler.width - 1
                            }
                        }
                        if (actor.position.y >= GameHandler.height) {
                            actor.position.y = 0
                        } else {
                            if (actor.position.y < 0) {
                                actor.position.y = GameHandler.height - 1
                            }
                        }
                    }
                }
            }
        },
        destroyEnemy: function destroyEnemy(enemy, parentVector) {
            if (enemy instanceof Asteroids.Asteroid) {
                this.generateBabyAsteroids(enemy, parentVector);
                var boom = new Asteroids.Explosion(enemy.position.clone(), enemy.vector.clone(), enemy.size);
                this.effects.push(boom);
                var vec = new Vector(0, -(Math.random() * 2 + 0.5));
                var effect = new Asteroids.ScoreIndicator(new Vector(enemy.position.x, enemy.position.y), vec, Math.floor(100 + (Math.random() * 100)));
                this.effects.push(effect)
            } else {
                if (enemy instanceof Asteroids.EnemyShip) {
                    var boom = new Asteroids.Explosion(enemy.position.clone(), enemy.vector.clone(), 3);
                    this.effects.push(boom)
                }
            }
        },
        generateBabyAsteroids: function generateBabyAsteroids(asteroid, parentVector) {
            if (asteroid.size > 1) {
                for (var x = 0, xc = Math.floor(asteroid.size / 2); x < xc; x++) {
                    var babySize = asteroid.size - 1;
                    var vec = asteroid.vector.clone();
                    var t = new Vector(0, -(Math.random() * 3));
                    t.rotate(asteroid.vector.theta() * (Math.random() * Math.PI));
                    vec.add(t);
                    vec.add(parentVector.clone().scale(0.2));
                    var baby = new Asteroids.Asteroid(new Vector(asteroid.position.x + (Math.random() * 5) - 2.5, asteroid.position.y + (Math.random() * 5) - 2.5), vec, babySize, asteroid.type);
                    this.enemies.push(baby)
                }
            }
        },
        renderActors: function renderActors(ctx) {
            for (var i = 0, j = this.actors.length; i < j; i++) {
                var actorList = this.actors[i];
                for (var n = actorList.length - 1; n >= 0; n--) {
                    actorList[n].onRender(ctx)
                }
            }
        },
        renderOverlay: function renderOverlay(ctx) {
            ctx.save();
            ctx.strokeStyle = "rgb(50,50,255)";
            ctx.strokeRect(4, 4, 101, 6);
            ctx.fillStyle = "rgb(100,100,255)";
            var energy = this.player.energy;
            if (energy > this.player.ENERGY_INIT) {
                energy = this.player.ENERGY_INIT
            }
            ctx.fillRect(5, 5, (energy / (this.player.ENERGY_INIT / 100)), 5);
            for (var i = 0; i < this.game.lives; i++) {
                if (BITMAPS) {
                    ctx.drawImage(g_playerImg, 0, 0, 64, 64, 350 + (i * 20), 0, 16, 16)
                } else {
                    ctx.save();
                    ctx.shadowColor = ctx.strokeStyle = "rgb(255,255,255)";
                    ctx.translate(360 + (i * 16), 8);
                    ctx.beginPath();
                    ctx.moveTo(-4, 6);
                    ctx.lineTo(4, 6);
                    ctx.lineTo(0, -6);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.restore()
                }
            }
            Game.fillText(ctx, "00000000", "12pt Courier New", 120, 12, "white");
            Game.fillText(ctx, "HI: 00000000", "12pt Courier New", 220, 12, "white");
            Game.fillText(ctx, "FPS: " + GameHandler.maxfps, "12pt Courier New", 0, GameHandler.height - 2, "lightblue");
            ctx.restore()
        }
    })
})();
(function () {
    Asteroids.Star = function () {
        return this
    };
    Asteroids.Star.prototype = {
        MAXZ: 12,
        VELOCITY: 1.5,
        MAXSIZE: 5,
        x: 0,
        y: 0,
        z: 0,
        prevx: 0,
        prevy: 0,
        init: function b() {
            this.x = (Math.random() * GameHandler.width - (GameHandler.width * 0.5)) * this.MAXZ;
            this.y = (Math.random() * GameHandler.height - (GameHandler.height * 0.5)) * this.MAXZ;
            this.z = this.MAXZ
        },
        render: function a(c) {
            var e = this.x / this.z;
            var f = this.y / this.z;
            var d = 1 / this.z * this.MAXSIZE + 1;
            c.save();
            c.fillStyle = "rgb(200,200,200)";
            c.beginPath();
            c.arc(e + (GameHandler.width / 2), f + (GameHandler.height / 2), d / 2, 0, TWOPI, true);
            c.closePath();
            c.fill();
            c.restore();
            this.prevx = e;
            this.prevy = f
        }
    }
})();
(function () {
    Asteroids.Player = function (o, m, n) {
        Asteroids.Player.superclass.constructor.call(this, o, m);
        this.heading = n;
        this.energy = this.ENERGY_INIT;
        this.animImage = g_shieldImg;
        this.animLength = this.SHIELD_ANIM_LENGTH;
        this.primaryWeapons = [];
        this.primaryWeapons.main = new Asteroids.PrimaryWeapon(this);
        return this
    };
    extend(Asteroids.Player, Game.SpriteActor, {
        MAX_PLAYER_VELOCITY: 10,
        PLAYER_RADIUS: 10,
        SHIELD_RADIUS: 14,
        SHIELD_ANIM_LENGTH: 100,
        SHIELD_MIN_PULSE: 20,
        ENERGY_INIT: 200,
        THRUST_DELAY: 1,
        BOMB_RECHARGE: 20,
        BOMB_ENERGY: 40,
        heading: 0,
        energy: 0,
        shieldCounter: 0,
        alive: true,
        primaryWeapons: null,
        bombRecharge: 0,
        thrustRecharge: 0,
        engineThrust: false,
        killedOnFrame: 0,
        fireWhenShield: false,
        onRender: function l(m) {
            var p = this.heading * RAD;
            if (this.engineThrust) {
                m.save();
                m.translate(this.position.x, this.position.y);
                m.rotate(p);
                m.globalAlpha = 0.4 + Math.random() / 2;
                if (BITMAPS) {
                    m.fillStyle = "rgb(25,125,255)"
                } else {
                    m.shadowColor = m.strokeStyle = "rgb(25,125,255)"
                }
                m.beginPath();
                m.moveTo(-5, 8);
                m.lineTo(5, 8);
                m.lineTo(0, 15 + Math.random() * 7);
                m.closePath();
                if (BITMAPS) {
                    m.fill()
                } else {
                    m.stroke()
                }
                m.restore();
                this.engineThrust = false
            }
            if (BITMAPS) {
                var o = (this.PLAYER_RADIUS * 2) + 4;
                var n = this.heading % 360;
                if (n < 0) {
                    n = 360 + n
                }
                m.drawImage(g_playerImg, 0, n * 16, 64, 64, this.position.x - (o / 2), this.position.y - (o / 2), o, o)
            } else {
                m.save();
                m.shadowColor = m.strokeStyle = "rgb(255,255,255)";
                m.translate(this.position.x, this.position.y);
                m.rotate(p);
                m.beginPath();
                m.moveTo(-6, 8);
                m.lineTo(6, 8);
                m.lineTo(0, -8);
                m.closePath();
                m.stroke();
                m.restore()
            }
            if (this.shieldCounter > 0 && this.energy > 0) {
                if (BITMAPS) {
                    m.save();
                    m.translate(this.position.x, this.position.y);
                    m.rotate(p);
                    this.renderSprite(m, -this.SHIELD_RADIUS - 1, -this.SHIELD_RADIUS - 1, (this.SHIELD_RADIUS * 2) + 2);
                    m.restore()
                } else {
                    m.save();
                    m.translate(this.position.x, this.position.y);
                    m.rotate(p);
                    m.shadowColor = m.strokeStyle = "rgb(100,100,255)";
                    m.beginPath();
                    m.arc(0, 2, this.SHIELD_RADIUS, 0, TWOPI, true);
                    m.closePath();
                    m.stroke();
                    m.restore()
                }
                this.shieldCounter--;
                this.energy--
            }
        },
        thrust: function a() {
            if (GameHandler.frameCount - this.thrustRecharge > this.THRUST_DELAY) {
                this.thrustRecharge = GameHandler.frameCount;
                var m = new Vector(0, -0.55);
                m.rotate(this.heading * RAD);
                var n = this.vector.clone();
                if (n.add(m).length() < this.MAX_PLAYER_VELOCITY) {
                    this.vector.add(m)
                }
            }
            this.engineThrust = true
        },
        activateShield: function c() {
            if (this.energy > 0) {
                this.shieldCounter = this.SHIELD_MIN_PULSE
            }
        },
        isShieldActive: function k() {
            return (this.shieldCounter > 0 && this.energy > 0)
        },
        radius: function f() {
            return (this.isShieldActive() ? this.SHIELD_RADIUS : this.PLAYER_RADIUS)
        },
        expired: function i() {
            return !(this.alive)
        },
        kill: function g() {
            this.alive = false;
            this.killedOnFrame = GameHandler.frameCount
        },
        firePrimary: function e(p) {
            if (this.alive && (!this.isShieldActive() || this.fireWhenShield)) {
                for (var n in this.primaryWeapons) {
                    var m = this.primaryWeapons[n].fire();
                    if (m) {
                        if (isArray(m)) {
                            for (var o = 0; o < m.length; o++) {
                                p.push(m[o])
                            }
                        } else {
                            p.push(m)
                        }
                    }
                }
            }
        },
        fireSecondary: function j(n) {
            if (this.alive && (!this.isShieldActive() || this.fireWhenShield) && this.energy > this.BOMB_ENERGY) {
                if (GameHandler.frameCount - this.bombRecharge > this.BOMB_RECHARGE) {
                    this.bombRecharge = GameHandler.frameCount;
                    this.energy -= this.BOMB_ENERGY;
                    var m = new Vector(0, -6);
                    m.rotate(this.heading * RAD);
                    m.add(this.vector);
                    n.push(new Asteroids.Bomb(this.position.clone(), m))
                }
            }
        },
        onUpdate: function b() {
            if (!this.isShieldActive() && this.energy < this.ENERGY_INIT) {
                this.energy += 0.1
            }
        },
        reset: function d(m) {
            this.alive = true;
            if (!m) {
                this.primaryWeapons = [];
                this.primaryWeapons.main = new Asteroids.PrimaryWeapon(this);
                this.fireWhenShield = false
            }
            this.energy = this.ENERGY_INIT + this.SHIELD_MIN_PULSE;
            this.activateShield()
        }
    })
})();
(function () {
    Asteroids.Asteroid = function (p, v, s, t) {
        Asteroids.Asteroid.superclass.constructor.call(this, p, v);
        this.size = s;
        this.health = s;
        if (t === undefined) {
            t = randomInt(1, 4)
        }
        eval("this.animImage=g_asteroidImg" + t);
        this.type = t;
        this.animForward = (Math.random() < 0.5);
        this.animSpeed = 0.25 + Math.random();
        this.animLength = this.ANIMATION_LENGTH;
        this.rotation = randomInt(0, 180);
        this.rotationSpeed = randomInt(-1, 1) / 25;
        return this
    };
    extend(Asteroids.Asteroid, Game.EnemyActor, {
        ANIMATION_LENGTH: 180,
        size: 0,
        type: 1,
        health: 0,
        rotation: 0,
        rotationSpeed: 0,
        onRender: function onRender(ctx) {
            var rad = this.size * 8;
            ctx.save();
            if (BITMAPS) {
                this.renderSprite(ctx, this.position.x - rad - 2, this.position.y - rad - 2, (rad * 2) + 4, true)
            } else {
                ctx.shadowColor = ctx.strokeStyle = "white";
                ctx.translate(this.position.x, this.position.y);
                ctx.scale(this.size * 0.8, this.size * 0.8);
                ctx.rotate(this.rotation += this.rotationSpeed);
                ctx.lineWidth = (0.8 / this.size) * 2;
                ctx.beginPath();
                switch (this.type) {
                    case 1:
                        ctx.moveTo(0, 10);
                        ctx.lineTo(8, 6);
                        ctx.lineTo(10, -4);
                        ctx.lineTo(4, -2);
                        ctx.lineTo(6, -6);
                        ctx.lineTo(0, -10);
                        ctx.lineTo(-10, -3);
                        ctx.lineTo(-10, 5);
                        break;
                    case 2:
                        ctx.moveTo(0, 10);
                        ctx.lineTo(8, 6);
                        ctx.lineTo(10, -4);
                        ctx.lineTo(4, -2);
                        ctx.lineTo(6, -6);
                        ctx.lineTo(0, -10);
                        ctx.lineTo(-8, -8);
                        ctx.lineTo(-6, -3);
                        ctx.lineTo(-8, -4);
                        ctx.lineTo(-10, 5);
                        break;
                    case 3:
                        ctx.moveTo(-4, 10);
                        ctx.lineTo(1, 8);
                        ctx.lineTo(7, 10);
                        ctx.lineTo(10, -4);
                        ctx.lineTo(4, -2);
                        ctx.lineTo(6, -6);
                        ctx.lineTo(0, -10);
                        ctx.lineTo(-10, -3);
                        ctx.lineTo(-10, 5);
                        break;
                    case 4:
                        ctx.moveTo(-8, 10);
                        ctx.lineTo(7, 8);
                        ctx.lineTo(10, -2);
                        ctx.lineTo(6, -10);
                        ctx.lineTo(-2, -8);
                        ctx.lineTo(-6, -10);
                        ctx.lineTo(-10, -6);
                        ctx.lineTo(-7, 0);
                        break
                }
                ctx.closePath();
                ctx.stroke()
            }
            ctx.restore()
        },
        radius: function radius() {
            return this.size * 8
        },
        hit: function hit(force) {
            if (force !== -1) {
                this.health -= force
            } else {
                this.health = 0
            }
            return !(this.alive = (this.health > 0))
        }
    })
})();
(function () {
    Asteroids.EnemyShip = function (j, g) {
        this.size = g;
        if (this.size === 1) {
            this.BULLET_RECHARGE = 45;
            this.RADIUS = 8
        }
        var i, f;
        if (j.player.position.x < GameHandler.width / 2) {
            if (j.player.position.y < GameHandler.height / 2) {
                i = new Vector(GameHandler.width - 48, GameHandler.height - 48)
            } else {
                i = new Vector(GameHandler.width - 48, 48)
            }
            f = new Vector(-(Math.random() + 1 + g), Math.random() + 0.5 + g)
        } else {
            if (j.player.position.y < GameHandler.height / 2) {
                i = new Vector(0, GameHandler.height - 48)
            } else {
                i = new Vector(0, 48)
            }
            f = new Vector(Math.random() + 1 + g, Math.random() + 0.5 + g)
        }
        this.animImage = g_enemyshipImg;
        this.animLength = this.SHIP_ANIM_LENGTH;
        Asteroids.EnemyShip.superclass.constructor.call(this, i, f);
        return this
    };
    extend(Asteroids.EnemyShip, Game.EnemyActor, {
        SHIP_ANIM_LENGTH: 90,
        RADIUS: 16,
        BULLET_RECHARGE: 60,
        alive: true,
        size: 0,
        bulletRecharge: 0,
        onUpdate: function b(i) {
            if (this.size === 0) {
                if (Math.random() < 0.01) {
                    this.vector.y = -(this.vector.y + (0.25 - (Math.random() / 2)))
                }
            } else {
                if (Math.random() < 0.02) {
                    this.vector.y = -(this.vector.y + (0.5 - Math.random()))
                }
            }
            if (GameHandler.frameCount - this.bulletRecharge > this.BULLET_RECHARGE && i.player.alive) {
                this.bulletRecharge = GameHandler.frameCount;
                var g = i.player.position.clone().sub(this.position);
                var j = (this.size === 0 ? 5 : 6) / g.length();
                g.x *= j;
                g.y *= j;
                g.x += (this.size === 0 ? (Math.random() * 2 - 1) : (Math.random() - 0.5));
                g.y += (this.size === 0 ? (Math.random() * 2 - 1) : (Math.random() - 0.5));
                var f = new Asteroids.EnemyBullet(this.position.clone(), g);
                i.enemyBullets.push(f)
            }
        },
        onRender: function e(g) {
            if (BITMAPS) {
                var f = this.RADIUS + 2;
                this.renderSprite(g, this.position.x - f, this.position.y - f, f * 2, true)
            } else {
                g.save();
                g.translate(this.position.x, this.position.y);
                if (this.size === 0) {
                    g.scale(2, 2)
                }
                g.beginPath();
                g.moveTo(0, -4);
                g.lineTo(8, 3);
                g.lineTo(0, 8);
                g.lineTo(-8, 3);
                g.lineTo(0, -4);
                g.closePath();
                g.shadowColor = g.strokeStyle = "rgb(100,150,100)";
                g.stroke();
                g.beginPath();
                g.moveTo(0, -8);
                g.lineTo(4, -4);
                g.lineTo(0, 0);
                g.lineTo(-4, -4);
                g.lineTo(0, -8);
                g.closePath();
                g.shadowColor = g.strokeStyle = "rgb(150,200,150)";
                g.stroke();
                g.restore()
            }
        },
        radius: function a() {
            return this.RADIUS
        },
        hit: function d() {
            this.alive = false;
            return true
        },
        expired: function c() {
            return !this.alive
        }
    })
})();
(function () {
    Asteroids.Weapon = function (a) {
        this.player = a;
        return this
    };
    Asteroids.Weapon.prototype = {
        WEAPON_RECHARGE: 3, weaponRecharge: 0, player: null, fire: function () {
            if (GameHandler.frameCount - this.weaponRecharge > this.WEAPON_RECHARGE) {
                this.weaponRecharge = GameHandler.frameCount;
                return this.doFire()
            }
        }, doFire: function () {
        }
    }
})();
(function () {
    Asteroids.PrimaryWeapon = function (a) {
        Asteroids.PrimaryWeapon.superclass.constructor.call(this, a);
        return this
    };
    extend(Asteroids.PrimaryWeapon, Asteroids.Weapon, {
        doFire: function () {
            var a = new Vector(0, -8);
            a.rotate(this.player.heading * RAD);
            a.add(this.player.vector);
            return new Asteroids.Bullet(this.player.position.clone(), a, this.player.heading)
        }
    })
})();
(function () {
    Asteroids.TwinCannonsWeapon = function (a) {
        Asteroids.TwinCannonsWeapon.superclass.constructor.call(this, a);
        return this
    };
    extend(Asteroids.TwinCannonsWeapon, Asteroids.Weapon, {
        doFire: function () {
            var a = new Vector(0, -8);
            a.rotate(this.player.heading * RAD);
            a.add(this.player.vector);
            return new Asteroids.BulletX2(this.player.position.clone(), a, this.player.heading)
        }
    })
})();
(function () {
    Asteroids.VSprayCannonsWeapon = function (a) {
        this.WEAPON_RECHARGE = 5;
        Asteroids.VSprayCannonsWeapon.superclass.constructor.call(this, a);
        return this
    };
    extend(Asteroids.VSprayCannonsWeapon, Asteroids.Weapon, {
        doFire: function () {
            var b, c;
            var a = [];
            c = this.player.heading - 15;
            b = new Vector(0, -7).rotate(c * RAD).add(this.player.vector);
            a.push(new Asteroids.Bullet(this.player.position.clone(), b, c));
            c = this.player.heading;
            b = new Vector(0, -7).rotate(c * RAD).add(this.player.vector);
            a.push(new Asteroids.Bullet(this.player.position.clone(), b, c));
            c = this.player.heading + 15;
            b = new Vector(0, -7).rotate(c * RAD).add(this.player.vector);
            a.push(new Asteroids.Bullet(this.player.position.clone(), b, c));
            return a
        }
    })
})();
(function () {
    Asteroids.SideGunWeapon = function (a) {
        this.WEAPON_RECHARGE = 5;
        Asteroids.SideGunWeapon.superclass.constructor.call(this, a);
        return this
    };
    extend(Asteroids.SideGunWeapon, Asteroids.Weapon, {
        doFire: function () {
            var b, c;
            var a = [];
            c = this.player.heading - 90;
            b = new Vector(0, -8).rotate(c * RAD).add(this.player.vector);
            a.push(new Asteroids.Bullet(this.player.position.clone(), b, c, 25));
            c = this.player.heading + 90;
            b = new Vector(0, -8).rotate(c * RAD).add(this.player.vector);
            a.push(new Asteroids.Bullet(this.player.position.clone(), b, c, 25));
            return a
        }
    })
})();
(function () {
    Asteroids.RearGunWeapon = function (a) {
        this.WEAPON_RECHARGE = 5;
        Asteroids.RearGunWeapon.superclass.constructor.call(this, a);
        return this
    };
    extend(Asteroids.RearGunWeapon, Asteroids.Weapon, {
        doFire: function () {
            var a = new Vector(0, -8);
            var b = this.player.heading + 180;
            a.rotate(b * RAD);
            a.add(this.player.vector);
            return new Asteroids.Bullet(this.player.position.clone(), a, b, 25)
        }
    })
})();
(function () {
    Asteroids.Bullet = function (j, f, g, i) {
        Asteroids.Bullet.superclass.constructor.call(this, j, f);
        this.heading = g;
        if (i) {
            this.lifespan = i
        }
        return this
    };
    extend(Asteroids.Bullet, Game.Actor, {
        BULLET_WIDTH: 2,
        BULLET_HEIGHT: 6,
        FADE_LENGTH: 5,
        heading: 0,
        lifespan: 40,
        powerLevel: 1,
        onRender: function e(i) {
            var j = this.BULLET_WIDTH;
            var g = this.BULLET_HEIGHT;
            i.save();
            i.globalCompositeOperation = "lighter";
            if (this.lifespan < this.FADE_LENGTH) {
                i.globalAlpha = (1 / this.FADE_LENGTH) * this.lifespan
            }
            if (BITMAPS) {
                i.shadowBlur = 8;
                i.shadowColor = i.fillStyle = "rgb(50,255,50)"
            } else {
                i.shadowColor = i.strokeStyle = "rgb(50,255,50)"
            }
            i.translate(this.position.x, this.position.y);
            i.rotate(this.heading * RAD);
            var f = -(j / 2);
            var k = -(g / 2);
            if (BITMAPS) {
                i.fillRect(f, k, j, g);
                i.fillRect(f, k + 1, j, g - 1)
            } else {
                i.strokeRect(f, k - 1, j, g + 1);
                i.strokeRect(f, k, j, g)
            }
            i.restore()
        },
        expired: function d() {
            return (--this.lifespan === 0)
        },
        effectRadius: function b() {
            return 0
        },
        radius: function a() {
            return (this.BULLET_HEIGHT + this.BULLET_WIDTH) / 2
        },
        power: function c() {
            return this.powerLevel
        }
    })
})();
(function () {
    Asteroids.BulletX2 = function (e, c, d) {
        Asteroids.BulletX2.superclass.constructor.call(this, e, c, d);
        this.lifespan = 50;
        this.powerLevel = 2;
        return this
    };
    extend(Asteroids.BulletX2, Asteroids.Bullet, {
        onRender: function b(e) {
            var f = this.BULLET_WIDTH;
            var d = this.BULLET_HEIGHT;
            e.save();
            e.globalCompositeOperation = "lighter";
            if (this.lifespan < this.FADE_LENGTH) {
                e.globalAlpha = (1 / this.FADE_LENGTH) * this.lifespan
            }
            if (BITMAPS) {
                e.shadowBlur = 8;
                e.shadowColor = e.fillStyle = "rgb(50,255,128)"
            } else {
                e.shadowColor = e.strokeStyle = "rgb(50,255,128)"
            }
            e.translate(this.position.x, this.position.y);
            e.rotate(this.heading * RAD);
            var c = -(f / 2);
            var g = -(d / 2);
            if (BITMAPS) {
                e.fillRect(c - 4, g, f, d);
                e.fillRect(c - 4, g + 1, f, d - 1);
                e.fillRect(c + 4, g, f, d);
                e.fillRect(c + 4, g + 1, f, d - 1)
            } else {
                e.strokeRect(c - 4, g - 1, f, d + 1);
                e.strokeRect(c - 4, g, f, d);
                e.strokeRect(c + 4, g - 1, f, d + 1);
                e.strokeRect(c + 4, g, f, d)
            }
            e.restore()
        }, radius: function a() {
            return (this.BULLET_HEIGHT)
        }
    })
})();
(function () {
    Asteroids.Bomb = function (e, d) {
        Asteroids.Bomb.superclass.constructor.call(this, e, d);
        return this
    };
    extend(Asteroids.Bomb, Asteroids.Bullet, {
        BOMB_RADIUS: 4,
        FADE_LENGTH: 5,
        EFFECT_RADIUS: 45,
        lifespan: 80,
        onRender: function c(e) {
            var d = this.BOMB_RADIUS;
            e.save();
            e.globalCompositeOperation = "lighter";
            var g = 0.8;
            if (this.lifespan < this.FADE_LENGTH) {
                g = (0.8 / this.FADE_LENGTH) * this.lifespan;
                d = (this.BOMB_RADIUS / this.FADE_LENGTH) * this.lifespan
            }
            e.globalAlpha = g;
            if (BITMAPS) {
                e.fillStyle = "rgb(155,255,155)"
            } else {
                e.shadowColor = e.strokeStyle = "rgb(155,255,155)"
            }
            e.translate(this.position.x, this.position.y);
            e.rotate(GameHandler.frameCount % 360);
            if (!BITMAPS) {
                e.scale(0.8, 0.8)
            }
            e.beginPath();
            e.moveTo(d * 2, 0);
            for (var f = 0; f < 15; f++) {
                e.rotate(Math.PI / 8);
                if (f % 2 == 0) {
                    e.lineTo((d * 2 / 0.525731) * 0.200811, 0)
                } else {
                    e.lineTo(d * 2, 0)
                }
            }
            e.closePath();
            if (BITMAPS) {
                e.fill()
            } else {
                e.stroke()
            }
            e.restore()
        },
        effectRadius: function b() {
            return this.EFFECT_RADIUS
        },
        radius: function a() {
            var d = this.BOMB_RADIUS;
            if (this.lifespan <= this.FADE_LENGTH) {
                d = (this.BOMB_RADIUS / this.FADE_LENGTH) * this.lifespan
            }
            return d
        }
    })
})();
(function () {
    Asteroids.EnemyBullet = function (e, d) {
        Asteroids.EnemyBullet.superclass.constructor.call(this, e, d);
        return this
    };
    extend(Asteroids.EnemyBullet, Game.Actor, {
        BULLET_RADIUS: 4, FADE_LENGTH: 5, lifespan: 60, onRender: function c(e) {
            var d = this.BULLET_RADIUS;
            e.save();
            e.globalCompositeOperation = "lighter";
            var g = 0.7;
            if (this.lifespan < this.FADE_LENGTH) {
                g = (0.7 / this.FADE_LENGTH) * this.lifespan;
                d = (this.BULLET_RADIUS / this.FADE_LENGTH) * this.lifespan
            }
            e.globalAlpha = g;
            if (BITMAPS) {
                e.fillStyle = "rgb(150,255,150)"
            } else {
                e.shadowColor = e.strokeStyle = "rgb(150,255,150)"
            }
            e.beginPath();
            e.arc(this.position.x, this.position.y, (d - 1 > 0 ? d - 1 : 0.1), 0, TWOPI, true);
            e.closePath();
            if (BITMAPS) {
                e.fill()
            } else {
                e.stroke()
            }
            e.translate(this.position.x, this.position.y);
            e.rotate((GameHandler.frameCount % 720) / 2);
            e.beginPath();
            e.moveTo(d * 2, 0);
            for (var f = 0; f < 7; f++) {
                e.rotate(Math.PI / 4);
                if (f % 2 == 0) {
                    e.lineTo((d * 2 / 0.525731) * 0.200811, 0)
                } else {
                    e.lineTo(d * 2, 0)
                }
            }
            e.closePath();
            if (BITMAPS) {
                e.fill()
            } else {
                e.stroke()
            }
            e.restore()
        }, expired: function b() {
            return (--this.lifespan === 0)
        }, radius: function a() {
            var d = this.BULLET_RADIUS;
            if (this.lifespan <= this.FADE_LENGTH) {
                d = (d / this.FADE_LENGTH) * this.lifespan
            }
            return d
        }
    })
})();
(function () {
    Asteroids.Explosion = function (d, b, c) {
        Asteroids.Explosion.superclass.constructor.call(this, d, b, this.FADE_LENGTH);
        this.size = c;
        return this
    };
    extend(Asteroids.Explosion, Game.EffectActor, {
        FADE_LENGTH: 10, size: 0, onRender: function a(c) {
            var e = Math.floor((255 / this.FADE_LENGTH) * this.lifespan);
            var b = (this.size * 8 / this.FADE_LENGTH) * this.lifespan;
            var d = e.toString();
            c.save();
            c.globalAlpha = 0.75;
            c.fillStyle = "rgb(" + d + ",0,0)";
            c.beginPath();
            c.arc(this.position.x, this.position.y, b, 0, TWOPI, true);
            c.closePath();
            c.fill();
            c.restore()
        }
    })
})();
(function () {
    Asteroids.PlayerExplosion = function (c, b) {
        Asteroids.PlayerExplosion.superclass.constructor.call(this, c, b, this.FADE_LENGTH);
        return this
    };
    extend(Asteroids.PlayerExplosion, Game.EffectActor, {
        FADE_LENGTH: 15, onRender: function a(c) {
            c.save();
            var d = (1 / this.FADE_LENGTH) * this.lifespan;
            c.globalCompositeOperation = "lighter";
            c.globalAlpha = d;
            var b;
            if (this.lifespan > 5 && this.lifespan <= 15) {
                var e = this.lifespan - 5;
                b = (48 / this.FADE_LENGTH) * e;
                c.fillStyle = "rgb(255,170,30)";
                c.beginPath();
                c.arc(this.position.x - 2, this.position.y - 2, b, 0, TWOPI, true);
                c.closePath();
                c.fill()
            }
            if (this.lifespan > 2 && this.lifespan <= 12) {
                var e = this.lifespan - 2;
                b = (32 / this.FADE_LENGTH) * e;
                c.fillStyle = "rgb(255,255,50)";
                c.beginPath();
                c.arc(this.position.x + 2, this.position.y + 2, b, 0, TWOPI, true);
                c.closePath();
                c.fill()
            }
            if (this.lifespan <= 10) {
                var e = this.lifespan;
                b = (24 / this.FADE_LENGTH) * e;
                c.fillStyle = "rgb(255,70,100)";
                c.beginPath();
                c.arc(this.position.x + 2, this.position.y - 2, b, 0, TWOPI, true);
                c.closePath();
                c.fill()
            }
            c.restore()
        }
    })
})();
(function () {
    Asteroids.Impact = function (c, b) {
        Asteroids.Impact.superclass.constructor.call(this, c, b, this.FADE_LENGTH);
        return this
    };
    extend(Asteroids.Impact, Game.EffectActor, {
        FADE_LENGTH: 12, onRender: function a(b) {
            var c = (1 / this.FADE_LENGTH) * this.lifespan;
            b.save();
            b.globalAlpha = c * 0.75;
            if (BITMAPS) {
                b.fillStyle = "rgb(50,255,50)"
            } else {
                b.shadowColor = b.strokeStyle = "rgb(50,255,50)"
            }
            b.beginPath();
            b.arc(this.position.x, this.position.y, 2, 0, TWOPI, true);
            b.closePath();
            if (BITMAPS) {
                b.fill()
            } else {
                b.stroke()
            }
            b.globalAlpha = c;
            b.beginPath();
            b.arc(this.position.x, this.position.y, 1, 0, TWOPI, true);
            b.closePath();
            if (BITMAPS) {
                b.fill()
            } else {
                b.stroke()
            }
            b.restore()
        }
    })
})();
(function () {
    Asteroids.TextIndicator = function (f, b, g, d, e, c) {
        this.fadeLength = (c ? c : this.DEFAULT_FADE_LENGTH);
        Asteroids.TextIndicator.superclass.constructor.call(this, f, b, this.fadeLength);
        this.msg = g;
        if (d) {
            this.textSize = d
        }
        if (e) {
            this.colour = e
        }
        return this
    };
    extend(Asteroids.TextIndicator, Game.EffectActor, {
        DEFAULT_FADE_LENGTH: 16,
        fadeLength: 0,
        textSize: 12,
        msg: null,
        colour: "rgb(255,255,255)",
        onRender: function a(b) {
            var c = (1 / this.fadeLength) * this.lifespan;
            b.save();
            b.globalAlpha = c;
            Game.fillText(b, this.msg, this.textSize + "pt Courier New", this.position.x, this.position.y, this.colour);
            b.restore()
        }
    })
})();
(function () {
    Asteroids.ScoreIndicator = function (f, a, i, d, c, e, b) {
        var g = i.toString();
        if (c) {
            g = c + " " + g
        }
        Asteroids.ScoreIndicator.superclass.constructor.call(this, f, a, g, d, e, b);
        return this
    };
    extend(Asteroids.ScoreIndicator, Asteroids.TextIndicator, {})
})();
(function () {
    Asteroids.PowerUp = function (e, d) {
        Asteroids.PowerUp.superclass.constructor.call(this, e, d);
        return this
    };
    extend(Asteroids.PowerUp, Game.EffectActor, {
        RADIUS: 8, pulse: 128, pulseinc: 8, onRender: function c(d) {
            d.save();
            d.globalAlpha = 0.75;
            var e = "rgb(255," + this.pulse.toString() + ",0)";
            if (BITMAPS) {
                d.fillStyle = e;
                d.strokeStyle = "rgb(255,255,128)"
            } else {
                d.lineWidth = 2;
                d.shadowColor = d.strokeStyle = e
            }
            d.beginPath();
            d.arc(this.position.x, this.position.y, this.RADIUS, 0, TWOPI, true);
            d.closePath();
            if (BITMAPS) {
                d.fill()
            }
            d.stroke();
            d.restore();
            this.pulse += this.pulseinc;
            if (this.pulse > 255) {
                this.pulse = 256 - this.pulseinc;
                this.pulseinc = -this.pulseinc
            } else {
                if (this.pulse < 0) {
                    this.pulse = 0 - this.pulseinc;
                    this.pulseinc = -this.pulseinc
                }
            }
        }, radius: function a() {
            return this.RADIUS
        }, collected: function b(p, o, j) {
            var r = null;
            switch (randomInt(0, 9)) {
                case 0:
                case 1:
                    r = "Energy Boost!";
                    o.energy += o.ENERGY_INIT / 2;
                    if (o.energy > o.ENERGY_INIT) {
                        o.energy = o.ENERGY_INIT
                    }
                    break;
                case 2:
                    r = "Fire When Shielded!";
                    o.fireWhenShield = true;
                    break;
                case 3:
                    r = "Extra Life!";
                    p.lives++;
                    break;
                case 4:
                    r = "Slow Down Asteroids!";
                    for (var f = 0, g = j.enemies.length, i; f < g; f++) {
                        i = j.enemies[f];
                        if (i instanceof Asteroids.Asteroid) {
                            i.vector.scale(0.75)
                        }
                    }
                    break;
                case 5:
                    r = "Smart Bomb!";
                    var k = 96;
                    var e = new Asteroids.Explosion(this.position.clone(), this.vector.clone().scale(0.5), k / 8);
                    j.effects.push(e);
                    for (var f = 0, i, l = this.position; f < j.enemies.length; f++) {
                        i = j.enemies[f];
                        if (l.distance(i.position) <= k + i.radius()) {
                            i.hit(-1);
                            j.generatePowerUp(i);
                            j.destroyEnemy(i, this.vector, true)
                        }
                    }
                    break;
                case 6:
                    r = "Twin Cannons!";
                    o.primaryWeapons.main = new Asteroids.TwinCannonsWeapon(o);
                    break;
                case 7:
                    r = "Spray Cannons!";
                    o.primaryWeapons.main = new Asteroids.VSprayCannonsWeapon(o);
                    break;
                case 8:
                    r = "Rear Gun!";
                    o.primaryWeapons.rear = new Asteroids.RearGunWeapon(o);
                    break;
                case 9:
                    r = "Side Guns!";
                    o.primaryWeapons.side = new Asteroids.SideGunWeapon(o);
                    break
            }
            if (r) {
                var d = new Vector(0, -3);
                var q = new Asteroids.TextIndicator(new Vector(this.position.x, this.position.y - this.RADIUS), d, r, null, null, 32);
                j.effects.push(q)
            }
        }
    })
})();
