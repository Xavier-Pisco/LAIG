class MyBarrel extends CGFobject {

	/**
   * Constructor for MyBarrel class
   * This function initializes the Rectangle, the Appearence, the Texture and the Shader
   * @param {CGFscene} scene current scene
   * @param {Float} barrel base radius
   * @param {Float} barrel middle radius
   * @param {Float} barrel height
   * @param {Float} barrel slices
   * @param {Array} barrel stacks
   */


	constructor(scene, base, middle, height, slices, stacks) {
		super(scene);
		this.base = base;
		this.middle = middle;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		var H = 4 / 3 * (this.middle - this.base);

		var angle = Math.atan(H / (this.height / 3));

		var h = 4 / 3 * this.base;

		var controlPoints1 = [
			[			//P4
				[base, 0, 0, 1],
				[base + H, 0, H / Math.tan(angle), 1],
				[base + H, 0, this.height - H / Math.tan(angle), 1],
				[base, 0, this.height, 1]
			],
			[			//P3
				[base, h, 0, 1],
				[base + H, h + H, H / Math.tan(angle), 1],
				[base + H, h + H, this.height - H / Math.tan(angle), 1],
				[base, h, this.height, 1]
			],
			[			//P2
				[-base, h, 0, 1],
				[-base - H, h + H, H / Math.tan(angle), 1],
				[-base - H, h + H, this.height - H / Math.tan(angle), 1],
				[-base, h, this.height, 1]
			],
			[			//P1
				[-base, 0, 0, 1],
				[-base - H, 0, H / Math.tan(angle), 1],
				[-base - H, 0, this.height - H / Math.tan(angle), 1],
				[-base, 0, this.height, 1]
			]

		];
		var controlPoints2 = [
			[			//P1
				[-base, 0, 0, 1],
				[-base - H, 0, H / Math.tan(angle), 1],
				[-base - H, 0, this.height - H / Math.tan(angle), 1],
				[-base, 0, this.height, 1]
			],
			[			//P2
				[-base, -h, 0, 1],
				[-base - H, -h - H, H / Math.tan(angle), 1],
				[-base - H, -h - H, this.height - H / Math.tan(angle), 1],
				[-base, -h, height, 1]
			],
			[			//P3
				[base, -h, 0, 1],
				[base + H, -h - H, H / Math.tan(angle), 1],
				[base + H, -h - H, this.height - H / Math.tan(angle), 1],
				[base, -h, this.height, 1]
			],
			[			//P4
				[base, 0, 0, 1],
				[base + H, 0, H / Math.tan(angle), 1],
				[base + H, 0, this.height - (H / Math.tan(angle)), 1],
				[base, 0, this.height, 1]
			]

		];
		let barrelSurface1 = new CGFnurbsSurface(3, 3, controlPoints1);
		this.barrel1 = new CGFnurbsObject(this.scene, this.slices, this.stacks, barrelSurface1);
		let barrelSurface2 = new CGFnurbsSurface(3, 3, controlPoints2);
		this.barrel2 = new CGFnurbsObject(this.scene, this.slices, this.stacks, barrelSurface2);

	};

	display() {
		this.barrel1.display();
		this.barrel2.display();
	}
};
