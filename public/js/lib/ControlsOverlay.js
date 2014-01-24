/**
 * Copyright (c) 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global window, document, console, cc */

var ControlsOverlay = cc.Node.extend({
	controls: null,	/* An array of all of our controls (Joysticks and Buttons.) */

	/**
	 * REQUIRED params
	 * canvas - <canvas> element to add our touch events to.
	 **/
	ctor: function (params) {
		'use strict';

		if (typeof params.canvas === 'undefined') {
			console.log('Missing required parameter: canvas');
		} else {
			this._super();

			/* Initialize our controls arrays. */
			this.controls = [];

			/* Add HTML5 touch listeners to our <canvas>. */
			params.canvas.addEventListener('touchstart', this.onTouchStart, false);
			params.canvas.addEventListener('touchmove', this.onTouchMove, false);
			params.canvas.addEventListener('touchend', this.onTouchEnd, false);

			/* We need to reference these controls from the <canvas>. */
			params.canvas.controlOverlay = this;
		}
	},

	/**
	 * Default behaviour for when we touch a control:
	 * - Cycle through all touchstart events.
	 * - Check whether each touch is interacting with a control (that isn't already being interacted with.)
	 * - If the touch is interacting with a control, assign that touch to this control and invoke the default touchstart behaviour.
	 */
	onTouchStart: function (e) {
		'use strict';
		var touches, touch, point, control, n, m;

		e.preventDefault();
		touches = e.changedTouches;

		for (n = 0; n < touches.length; n = n + 1) {
			touch = touches[n];
			point = new cc.Point(touch.clientX, this.height - touch.clientY);
			for (m = 0; m < this.controlOverlay.controls.length; m = m + 1) {
				control = this.controlOverlay.controls[m];
				if (cc.Rect.CCRectContainsPoint(control.trigger, point) === true) {
					if (control.identifier === -1) {
						control.identifier = touch.identifier;
						control._onTouchStart(touch, point);
					}
				}
			}
		}
	},

	/**
	 * Default behaviour for when an assigned touch moves:
	 * - Cycle through all touchmove events.
	 * - Check whether each touch is assigned to a control.
	 * - If the touch is assigned to a control, invoke the default touchmove behaviour.
	 */
	onTouchMove: function (e) {
		'use strict';
		var touches, touch, point, control, n, m;

		e.preventDefault();
		touches = e.changedTouches;

		for (n = 0; n < touches.length; n = n + 1) {
			touch = touches[n];
			point = new cc.Point(touch.clientX, this.height - touch.clientY);
			for (m = 0; m < this.controlOverlay.controls.length; m = m + 1) {
				control = this.controlOverlay.controls[m];
				if (control.identifier === touch.identifier) {
					control._onTouchMove(touch, point);
				}
			}
		}
	},

	/**
	 * Default behaviour for when an assigned touch is released:
	 * - Cycle through all the touchend events.
	 * - Check whether each touch is assigned to a control.
	 * - If the touch is assigned to a control, invoke the default touchend behaviour.
	 */
	onTouchEnd: function (e) {
		'use strict';
		var touches, touch, point, control, n, m;

		e.preventDefault();
		touches = e.changedTouches;

		for (n = 0; n < touches.length; n = n + 1) {
			touch = touches[n];
			point = new cc.Point(touch.clientX, this.height - touch.clientY);
			for (m = 0; m < this.controlOverlay.controls.length; m = m + 1) {
				control = this.controlOverlay.controls[m];
				if (control.identifier === touch.identifier) {
					control._onTouchEnd(touch, point);
					control.identifier = -1;
				}
			}
		}
	},

	/**
	 * REQUIRED params
	 * imageBase	- String: Path to image resource for joystick base.
	 * imagePad		- String: Path to image resource for joystick pad.
	 * fixed		- boolean: true if the joystick is stationary, false if the repositions to the touch point.
	 * 
	 * OPTIONAL params
	 * pos			- cc.Point: Position on <canvas> to place this joystick. Default is (0, 0).
	 * trigger		- cc.Rect: Bounding box where touch points will trigger this joystick. Default boundingBox of joystick.
	 * opacLow		- number: Minimum opacity of this control (0.0 - 255.0). Default 255.0.
	 * opacHigh		- number: Maximum opacity of this control (0.0 - 255.0). Default 255.0.
	 **/
	addJoystick: function (params) {
		'use strict';
		var joystick;

		/* Ensure that our required parameters are present. */
		if (typeof params.imageBase === 'undefined') {
			console.log('Missing required parameter: imageBase');
		} else if (typeof params.imagePad === 'undefined') {
			console.log('Missing required parameter: imagePad');
		} else if (typeof params.fixed === 'undefined') {
			console.log('Missing required parameter: fixed');
		} else {
			/* Initialize the basic parameters for a Joystick. */
			joystick = cc.Sprite.create(params.imageBase);
			joystick.setScale(1.0);
			joystick.fixed = params.fixed;
			joystick.identifier = -1;
			joystick.velocity = new cc.Point(0, 0);
			joystick.direction = 0;

			/* Set the Joystick's position. */
			params.pos = typeof params.pos !== 'undefined' ? params.pos : new cc.Point(0, 0);
			joystick.setPosition(params.pos);

			/* Set the Joystick's trigger rectangle. */
			params.trigger = typeof params.trigger !== 'undefined' ? params.trigger : joystick.getBoundingBox();
			joystick.trigger = params.trigger;

			/* Set the low and high opacity limits for the Joystick. */
			params.opacLow = typeof params.opacLow !== 'undefined' ? params.opacLow : 255.0;
			params.opacHigh = typeof params.opacHigh !== 'undefined' ? params.opacHigh : 255.0;
			joystick.opacLow = params.opacLow;
			joystick.opacHigh = params.opacHigh;
			joystick.setOpacity(joystick.opacLow);

			/* Create the Joystick pad that follows the touch point. */
			joystick.pad = cc.Sprite.create(params.imagePad);
			joystick.pad.setScale(1.0);
			joystick.pad.setPosition(new cc.Point(joystick.getContentSize().width / 2.0, joystick.getContentSize().height / 2.0));
			joystick.pad.setOpacity(params.opacLow);

			/* Default behaviour when a touchstart event occurs for a Joystick. */
			joystick._onTouchStart = function (touch, point) {
				/* This will be used to calculate the time for fading in. */
				var dt;

				/* If this Joystick is free-floating, reposition it to this touch point's coordinates. */
				if (this.fixed === false) {
					this.setPosition(point);
				}

				/* Invoke _onTouchMove to handle animation. */
				this._onTouchMove(touch, point);

				/* If there is a user-defined onTouchStart function, invoke it now. */
				if (this.onTouchStart) {
					this.onTouchStart(touch, point);
				}

				/* Stop any animations that were previously occurring with this Joystick. */
				this.pad.stopAllActions();
				this.stopAllActions();

				/** 
				 * Calculate the time to fade in from the current opacity to the maximum opacity.
				 *
				 * At most, this will take 0.3 seconds if the control's current opacity is equal to its minimum opacity.
				 * Otherwise, we will take a portion of the range and calculate based on that. For example, if the minimum
				 * opacity is 0, the maximum opacity is 100, and the current opacity is 50 (i.e. the control was in the middle
				 * of fading out), then we we will fade in from 50 to 100 opacity, over 1.5 seconds; half the maximum time of
				 * 0.3 seconds, since we are starting at an opacity that is already halfway to the maximum.
				 *
				 * Once calculated, we execute the FadeTo action.
				 */
				dt = 0.3 * (1.0 - ((this.getOpacity() - this.opacLow) / (this.opacHigh - this.opacLow)));
				this.runAction(cc.FadeTo.create(dt, this.opacHigh));
			};

			/* Default behaviour when a touchmove event occurs for a Joystick. */
			joystick._onTouchMove = function (touch, point) {
				/* We will use these variables to calculate where the touch is in relation to the Joystick base. */
				var dx, dy, r, _r;

				/* The delta X and delta Y values between the touch point and Joystick base. */
				dx = point.x - this.getPositionX();
				dy = point.y - this.getPositionY();

				/* The absolute radius (distance) between the Joystick base and the touch point. */
				r = Math.sqrt(dx * dx + dy * dy);

				/* Our Joystick pad's position will not be allowed to exceed 40.0 pixels from the center of the Joystick base. */
				_r = Math.min(r, 40.0);

				/* Recalculate the delta X based on the shortened radius. */
				dx = dx * _r / r;
				if (isNaN(dx) === true) {
					dx = 0.0;
				}

				/* Recalculate the delta Y based on the shortened radius. */
				dy = dy * _r / r;
				if (isNaN(dy) === true) {
					dy = 0.0;
				}

				/* We keep track of a velocity for this Joystick (i.e. how far away from the center is the Joystick pad.) */
				this.velocity = new cc.Point(dx, dy);

				/**
				 * Each Joystick is 8-directional. The direction is an integer corresponding to a compass direction:
				 * 0: West
				 * 1: NorthWest
				 * 2: North
				 * 3: NorthEast
				 * 4: East
				 * 5: SouthEast
				 * 6: South
				 * 7: SouthWest
				 * The formula below leverages the dy and dx values calculated to find which region the touch point inhabits,
				 * in relation to the Joystick.
				 */
				this.direction = Math.floor(4 + (-Math.atan2(dy, dx) + Math.PI / 8) * 4 / Math.PI) % 8;

				/* If there is user-defined onTouchMove function, invoke it now. */
				if (this.onTouchMove) {
					this.onTouchMove(touch, point);
				}

				/* Reposition the pad based on the touch point. */
				this.pad.setPosition(new cc.Point(dx + this.getContentSize().width / 2.0, dy + this.getContentSize().height / 2.0));
			};

			/* Default behaviour when a touchend event occurs for a Joystick. */
			joystick._onTouchEnd = function (touch, point) {
				/* This will be used to calculate the time for fading out. */
				var dt;

				/* Reset the velocity of this Joystick to zeros. */
				this.velocity = new cc.Point(0, 0);

				/* If there is a user-defined onTouchEnd function, invoke it now. */
				if (this.onTouchEnd) {
					this.onTouchEnd(touch, point);
				}

				/* Stop any animations that were previously occurring with this Joystick. */
				this.pad.stopAllActions();
				this.stopAllActions();

				/** 
				 * Calculate the time to fade out from the current opacity to the minimum opacity.
				 *
				 * At most, this will take 0.3 seconds if the control's current opacity is equal to its maximum opacity.
				 * Otherwise, we will take a portion of the range and calculate based on that. For example, if the maximum
				 * opacity is 100, the minimum opacity is 0, and the current opacity is 50 (i.e. the control was in the middle
				 * of fading in), then we we will fade out from 50 to 0 opacity, over 1.5 seconds; half the maximum time of
				 * 0.3 seconds, since we are starting at an opacity that is already halfway to the minimum.
				 *
				 * Once calculated, we execute the FadeTo action.
				 */
				dt = 0.3 * ((this.getOpacity() - this.opacLow) / (this.opacHigh - this.opacLow));
				this.pad.runAction(cc.MoveTo.create(dt, new cc.Point(this.getContentSize().width / 2.0, this.getContentSize().height / 2.0)));
				this.runAction(cc.FadeTo.create(dt, this.opacLow));
			};

			/* Combine our Joystick pad with our Joystick base and add the Joystick to our ControlsOverlay Node. */
			joystick.addChild(joystick.pad);
			this.addChild(joystick);

			/* Initiate an update to ensure the Joystick pad's opacity always matches the Joystick base's opacity. */
			joystick.update = function () {
				joystick.pad.setOpacity(joystick.getOpacity());
			};

			/* Start running our update check. */
			joystick.scheduleUpdate();

			/* Add this Joystick to our array of controls. */
			this.controls.push(joystick);

			/* Return the newly created control in case we want to add custom touch implementations. */
			return joystick;
		}
	},

	/**
	 * REQUIRED params
	 * image		- String: Path to image resource for the button.
	 * pos			- cc.Point: Position on <canvas> to place this button. Default is (0, 0).
	 * 
	 * OPTIONAL params
	 * trigger		- cc.Rect: Bounding box where touch points will trigger this button. Default boundingBox of button.
	 * opacLow		- number: Minimum opacity of this control (0.0 - 255.0). Default 255.0.
	 * opacHigh		- number: Maximum opacity of this control (0.0 - 255.0). Default 255.0.
	 **/
	addButton: function (params) {
		'use strict';
		var button;

		/* Ensure that our required parameters are present. */
		if (typeof params.image === 'undefined') {
			console.log('Missing required parameter: image');
		} else if (typeof params.pos === 'undefined') {
			console.log('Missing required parameter: pos');
		} else {
			/* Initialize the basic parameters for a Button. */
			button = cc.Sprite.create(params.image);
			button.setScale(1.0);
			button.identifier = -1;

			/* Set the Button's position. */
			params.pos = typeof params.pos !== 'undefined' ? params.pos : new cc.Point(0, 0);
			button.setPosition(params.pos);

			/* Set the Button's trigger rectangle. */
			params.trigger = typeof params.trigger !== 'undefined' ? params.trigger : button.getBoundingBox();
			button.trigger = params.trigger;

			/* Set the low and high opacity limits for the Button. */
			params.opacLow = typeof params.opacLow !== 'undefined' ? params.opacLow : 255.0;
			params.opacHigh = typeof params.opacHigh !== 'undefined' ? params.opacHigh : 255.0;
			button.opacLow = params.opacLow;
			button.opacHigh = params.opacHigh;
			button.setOpacity(button.opacLow);

			/* Default behaviour when a touchstart event occurs for a Button. */
			button._onTouchStart = function (touch, point) {
				/* If there is a user-defined onTouchStart function, invoke it now. */
				if (this.onTouchStart) {
					this.onTouchStart(touch, point);
				}

				/* Stop any animations that were previously occurring with this Button. */
				this.stopAllActions();

				/* Instantly set the opacity of this button to its maximum. */
				this.setOpacity(this.opacHigh);
			};

			/* Default behaviour when a touchmove event occurs for a Button. */
			button._onTouchMove = function (touch, point) {
				/* If there is a user-defined onTouchMove function, invoke it now. */
				if (this.onTouchMove) {
					this.onTouchMove(touch, point);
				}
			};

			/* Default behaviour when a touchend event occurs for a Button. */
			button._onTouchEnd = function (touch, point) {
				/* If there is a user-defined onTouchEnd function, invoke it now. */
				if (this.onTouchEnd) {
					this.onTouchEnd(touch, point);
				}

				/* Fade the button back to its minimum opacity over 1.0 seconds. */
				this.runAction(cc.FadeTo.create(1.0, this.opacLow));
			};

			/* Add the Button to our ControlsOverlay Node. */
			this.addChild(button);

			/* Add this button to our array of controls. */
			this.controls.push(button);

			/* Return the newly created control in case we want to add custom touch implementations. */
			return button;
		}
	}
});