import { SolidDefinition, SolidId } from '../types/geometry';

export const SOLIDS_DATA: Record<SolidId, SolidDefinition> = {
  cube: {
    id: 'cube',
    nameArabic: 'المكعب',
    nameEnglish: 'Cube',
    category: 'منشورات ومكعبات',
    description: 'مجسم هندسي ثلاثي الأبعاد منتظم، يتكون من 6 أوجه مربعة متطابقة، وله 12 حرفاً متساوياً في الطول، و 8 رؤوس.',
    facesCount: 6,
    edgesCount: 12,
    verticesCount: 8,
    facesDescription: '6 أوجه مربعة متطابقة تماماً',
    color: '#3b82f6', // blue
    accentColor: '#1d4ed8',
    eulerApplies: true,
    funFact: 'للمكعب 11 شبكة مختلفة يمكن طيّ كل واحدة منها لتكوين مكعب كامل بدون تداخل للأوجه!',
    netDescription: 'تتكون شبكته من 6 مربعات متصلة (أشهرها شكل الصليب أو الحرف T)، ويمكن طي الجوانب بزاوية 90° لتلتقي جميع الأحرف بإحكام.',
    dimensions: [
      {
        id: 'side',
        name: 'طول الضلع (الحرف)',
        symbol: 'ل',
        min: 2,
        max: 10,
        step: 0.5,
        defaultValue: 5,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدة السفلية', shape: 'مربع', count: 1, dimensionsDescription: 'ل × ل' },
      { name: 'القاعدة العلوية', shape: 'مربع', count: 1, dimensionsDescription: 'ل × ل' },
      { name: 'الأوجه الجانبية', shape: 'مربعات', count: 4, dimensionsDescription: '4 × (ل × ل)' },
    ],
    calculateProperties: (dims) => {
      const s = dims.side || 5;
      const lateralArea = 4 * s * s;
      const totalArea = 6 * s * s;
      const volume = s * s * s;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: '4 × ل²',
        totalFormula: '6 × ل²',
        volumeFormula: 'ل³',
        calculationSteps: [
          {
            label: 'مساحة الوجه الواحد (المربع)',
            formula: 'ل × ل',
            result: `${s} × ${s} = ${(s * s).toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الجانبية (4 أوجه)',
            formula: '4 × ل²',
            result: `4 × ${(s * s).toFixed(1)} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية (6 أوجه)',
            formula: '6 × ل²',
            result: `6 × ${(s * s).toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: 'ل × ل × ل',
            result: `${s} × ${s} × ${s} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  cuboid: {
    id: 'cuboid',
    nameArabic: 'متوازي المستطيلات',
    nameEnglish: 'Cuboid / Rectangular Prism',
    category: 'منشورات ومكعبات',
    description: 'مجسم ثلاثي الأبعاد جميع أوجهه الستة مستطيلة الشكل (أو 4 مستطيلة واثنان مربعان)، وكل وجهين متقابلين متطابقان ومتوازيان.',
    facesCount: 6,
    edgesCount: 12,
    verticesCount: 8,
    facesDescription: '6 أوجه مستطيلة (كل وجهين متقابلين متطابقان)',
    color: '#0ea5e9', // cyan/sky
    accentColor: '#0284c7',
    eulerApplies: true,
    funFact: 'علبة الهدايا والكتاب وخزانة الملابس وحاويات الشحن جميعها أمثلة واقعية على متوازي المستطيلات!',
    netDescription: 'تتكون شبكته من 3 أزواج من المستطيلات المتطابقة (القاعدتان، الوجهان الأمامي والخلفي، والوجهان الجانبيان الأيمن والأيسر).',
    dimensions: [
      {
        id: 'length',
        name: 'الطول (ط)',
        symbol: 'ط',
        min: 3,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: 'سم',
      },
      {
        id: 'width',
        name: 'العرض (ع)',
        symbol: 'ع',
        min: 2,
        max: 10,
        step: 0.5,
        defaultValue: 4,
        unit: 'سم',
      },
      {
        id: 'height',
        name: 'الارتفاع (ارت)',
        symbol: 'عـ',
        min: 2,
        max: 10,
        step: 0.5,
        defaultValue: 3,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدتان (السفلية والعلوية)', shape: 'مستطيل', count: 2, dimensionsDescription: 'ط × ع' },
      { name: 'الوجهان الأمامي والخلفي', shape: 'مستطيل', count: 2, dimensionsDescription: 'ط × عـ' },
      { name: 'الوجهان الجانبيان (اليمين واليسار)', shape: 'مستطيل', count: 2, dimensionsDescription: 'ع × عـ' },
    ],
    calculateProperties: (dims) => {
      const L = dims.length || 6;
      const W = dims.width || 4;
      const H = dims.height || 3;
      const lateralArea = 2 * (L + W) * H;
      const totalArea = 2 * (L * W + L * H + W * H);
      const volume = L * W * H;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: 'محيط القاعدة × الارتفاع = 2(ط + ع) × عـ',
        totalFormula: 'المساحة الجانبية + 2 × مساحة القاعدة = 2(ط×ع + ط×عـ + ع×عـ)',
        volumeFormula: 'الطول × العرض × الارتفاع = ط × ع × عـ',
        calculationSteps: [
          {
            label: 'محيط القاعدة المستطيلة',
            formula: '2 × (الطول + العرض)',
            result: `2 × (${L} + ${W}) = ${(2 * (L + W)).toFixed(1)} سم`,
          },
          {
            label: 'المساحة الجانبية',
            formula: 'محيط القاعدة × الارتفاع',
            result: `${(2 * (L + W)).toFixed(1)} × ${H} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'مساحة القاعدتين',
            formula: '2 × (الطول × العرض)',
            result: `2 × (${L} × ${W}) = ${(2 * L * W).toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية',
            formula: 'المساحة الجانبية + مساحة القاعدتين',
            result: `${lateralArea.toFixed(1)} + ${(2 * L * W).toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: 'ط × ع × عـ',
            result: `${L} × ${W} × ${H} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  square_pyramid: {
    id: 'square_pyramid',
    nameArabic: 'الهرم الرباعي القائم',
    nameEnglish: 'Square Pyramid',
    category: 'أهرامات',
    description: 'مجسم قاعدته مربعة الشكل وأوجهه الجانبية الأربعة عبارة عن مثلثات متساوية الساقين تلتقي رؤوسها جميعاً في نقطة واحدة تسمى قمة الهرم.',
    facesCount: 5,
    edgesCount: 8,
    verticesCount: 5,
    facesDescription: 'قاعدة مربعة واحدة + 4 أوجه مثلثة متساوية الساقين',
    color: '#f59e0b', // amber
    accentColor: '#d97706',
    eulerApplies: true,
    funFact: 'أهرامات الجيزة الخالدة في مصر هي أشهر مثال تاريخي وهندسي رائع على الهرم الرباعي القائم!',
    netDescription: 'تتكون شبكته من مربع مركزي في الوسط محاط بأربعة مثلثات متصلة بأضلاعه، وتُطوى المثلثات الأربعة لأعلى لتلتقي قممها مشكلة قمة الهرم.',
    dimensions: [
      {
        id: 'base',
        name: 'طول ضلع القاعدة المربعة (ق)',
        symbol: 'ق',
        min: 2,
        max: 10,
        step: 0.5,
        defaultValue: 5,
        unit: 'سم',
      },
      {
        id: 'slantHeight',
        name: 'الارتفاع المائل للوجه المثلث (ع_م)',
        symbol: 'ع_م',
        min: 3,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدة المربعة', shape: 'مربع', count: 1, dimensionsDescription: 'ق × ق' },
      { name: 'الأوجه الجانبية المثلثة', shape: 'مثلث متساوي الساقين', count: 4, dimensionsDescription: 'نصف × ق × ع_م' },
    ],
    calculateProperties: (dims) => {
      const b = dims.base || 5;
      const s = dims.slantHeight || 6;
      // vertical height h = sqrt(s^2 - (b/2)^2)
      const halfB = b / 2;
      const h = s > halfB ? Math.sqrt(s * s - halfB * halfB) : 0.1;
      const baseArea = b * b;
      const oneTriangleArea = 0.5 * b * s;
      const lateralArea = 4 * oneTriangleArea;
      const totalArea = baseArea + lateralArea;
      const volume = (1 / 3) * baseArea * h;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: '4 × (½ × طول ضلع القاعدة × الارتفاع المائل) = 2 × ق × ع_م',
        totalFormula: 'مساحة القاعدة + المساحة الجانبية = ق² + 2 × ق × ع_م',
        volumeFormula: '⅓ × مساحة القاعدة × الارتفاع العمودي = ⅓ × ق² × عـ',
        calculationSteps: [
          {
            label: 'مساحة القاعدة المربعة',
            formula: 'ق × ق',
            result: `${b} × ${b} = ${baseArea.toFixed(1)} سم²`,
          },
          {
            label: 'مساحة الوجه المثلث الواحد',
            formula: '½ × ق × الارتفاع المائل',
            result: `½ × ${b} × ${s} = ${oneTriangleArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الجانبية (4 مثلثات)',
            formula: '4 × مساحة المثلث',
            result: `4 × ${oneTriangleArea.toFixed(1)} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية',
            formula: 'مساحة القاعدة + المساحة الجانبية',
            result: `${baseArea.toFixed(1)} + ${lateralArea.toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الارتفاع العمودي التقريبي (عـ)',
            formula: '√(ع_م² - (ق/2)²)',
            result: `√(${s}² - ${(b / 2)}²) ≈ ${h.toFixed(1)} سم`,
          },
          {
            label: 'الحجم',
            formula: '⅓ × ق² × عـ',
            result: `⅓ × ${baseArea.toFixed(1)} × ${h.toFixed(1)} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  triangular_prism: {
    id: 'triangular_prism',
    nameArabic: 'المنشور الثلاثي القائم',
    nameEnglish: 'Triangular Prism',
    category: 'منشورات ومكعبات',
    description: 'مجسم ثلاثي الأبعاد له قاعدتان مثلثتان متطابقتان ومتوازيتان، وثلاثة أوجه جانبية مستطيلة الشكل.',
    facesCount: 5,
    edgesCount: 9,
    verticesCount: 6,
    facesDescription: 'قاعدتان مثلثتان متطابقتان + 3 أوجه جانبية مستطيلة',
    color: '#8b5cf6', // purple
    accentColor: '#6d28d9',
    eulerApplies: true,
    funFact: 'المنشور الزجاجي الثلاثي هو الأداة الفيزيائية الشهيرة التي استخدمها إسحاق نيوتن لتحليل الضوء الأبيض إلى ألوان الطيف السبعة!',
    netDescription: 'تتكون شبكته من 3 مستطيلات متجاورة تمثل الأوجه الجانبية، مع مثلثين متصلين بالمستطيل الأوسط يمثلان القاعدتين.',
    dimensions: [
      {
        id: 'sideA',
        name: 'طول ضلع المثلث (أ)',
        symbol: 'أ',
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 4,
        unit: 'سم',
      },
      {
        id: 'heightTri',
        name: 'ارتفاع قاعدة المثلث (ع_م)',
        symbol: 'ع_م',
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 3.5,
        unit: 'سم',
      },
      {
        id: 'prismHeight',
        name: 'ارتفاع المنشور (عـ)',
        symbol: 'عـ',
        min: 3,
        max: 12,
        step: 0.5,
        defaultValue: 7,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدتان المثلثتان', shape: 'مثلث', count: 2, dimensionsDescription: 'قاعدتان متطابقتان' },
      { name: 'الأوجه الجانبية المستطيلة', shape: 'مستطيل', count: 3, dimensionsDescription: '3 مستطيلات أبعادها: أ × عـ' },
    ],
    calculateProperties: (dims) => {
      const a = dims.sideA || 4;
      const ht = dims.heightTri || 3.5;
      const H = dims.prismHeight || 7;
      // assuming equilateral or isosceles triangle base for easy computation
      const baseArea = 0.5 * a * ht;
      const perimeterBase = 3 * a; // approximate equilateral base perimeter
      const lateralArea = perimeterBase * H;
      const totalArea = lateralArea + 2 * baseArea;
      const volume = baseArea * H;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: 'محيط المثلث × ارتفاع المنشور = (أ + ب + ج) × عـ',
        totalFormula: 'المساحة الجانبية + 2 × مساحة قاعدة المثلث',
        volumeFormula: 'مساحة قاعدة المثلث × ارتفاع المنشور',
        calculationSteps: [
          {
            label: 'مساحة القاعدة المثلثة الواحدة',
            formula: '½ × القاعدة × الارتفاع',
            result: `½ × ${a} × ${ht} = ${baseArea.toFixed(1)} سم²`,
          },
          {
            label: 'محيط قاعدة المثلث',
            formula: 'مجموع أطوال الأضلاع الثلاثة',
            result: `3 × ${a} = ${perimeterBase.toFixed(1)} سم`,
          },
          {
            label: 'المساحة الجانبية (3 مستطيلات)',
            formula: 'محيط القاعدة × ارتفاع المنشور',
            result: `${perimeterBase.toFixed(1)} × ${H} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية',
            formula: 'المساحة الجانبية + 2 × مساحة القاعدة',
            result: `${lateralArea.toFixed(1)} + ${(2 * baseArea).toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: 'مساحة القاعدة × الارتفاع',
            result: `${baseArea.toFixed(1)} × ${H} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  tetrahedron: {
    id: 'tetrahedron',
    nameArabic: 'الهرم الثلاثي (رباعي السطوح)',
    nameEnglish: 'Regular Tetrahedron',
    category: 'متعددة الوجوه',
    description: 'أبسط المجسمات متعددة الوجوه الأفلاطونية الخمسة المنتظمة، يتكون من 4 أوجه مثلثة متطابقة متساوية الأضلاع و 4 رؤوس و 6 أحرف.',
    facesCount: 4,
    edgesCount: 6,
    verticesCount: 4,
    facesDescription: '4 أوجه مثلثة متساوية الأضلاع ومتطابقة تماماً',
    color: '#ec4899', // pink
    accentColor: '#be185d',
    eulerApplies: true,
    funFact: 'جزيء الميثان (CH4) وتركيب بلورات الألماس تتوزع ذراتها في الفضاء وفق الشكل الهندسي لرباعي السطوح لتحقيق أعلى ثبات ممكن!',
    netDescription: 'تتكون شبكته إما من مثلث كبير مقسم إلى 4 مثلثات متساوية الأضلاع بالمنتصفات، أو شريط متسلسل من 4 مثلثات.',
    dimensions: [
      {
        id: 'side',
        name: 'طول الضلع (الحرف)',
        symbol: 'ل',
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 5,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'الأوجه الأربعة', shape: 'مثلث متساوي الأضلاع', count: 4, dimensionsDescription: '4 مثلثات متطابقة طول ضلع كل منها ل' },
    ],
    calculateProperties: (dims) => {
      const a = dims.side || 5;
      const oneFaceArea = (Math.sqrt(3) / 4) * a * a;
      const totalArea = 4 * oneFaceArea;
      const lateralArea = 3 * oneFaceArea;
      const volume = (Math.pow(a, 3)) / (6 * Math.SQRT2);
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: '3 × مساحة المثلث متساوي الأضلاع',
        totalFormula: '√3 × ل²',
        volumeFormula: 'ل³ / (6 × √2)',
        calculationSteps: [
          {
            label: 'مساحة الوجه المثلث الواحد',
            formula: '(√3 / 4) × ل²',
            result: `0.433 × ${a}² = ${oneFaceArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية (4 أوجه متطابقة)',
            formula: '√3 × ل²',
            result: `4 × ${oneFaceArea.toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: 'ل³ / (6 × √2)',
            result: `${(a * a * a).toFixed(1)} / 8.485 = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  cylinder: {
    id: 'cylinder',
    nameArabic: 'الأسطوانة الدائرية القائمة',
    nameEnglish: 'Right Circular Cylinder',
    category: 'مجسمات دورانية',
    description: 'مجسم دوراني يتولد من دوران مستطيل دورة كاملة حول أحد أضلاعه، له قاعدتان دائريتان متوازيتان ومتطابقتان وسطح منحنٍ أملس.',
    facesCount: 3,
    edgesCount: 2,
    verticesCount: 0,
    facesDescription: 'قاعدتان دائريتان متطابقتان + سطح جانبي منحنٍ (يُفرد إلى مستطيل)',
    color: '#10b981', // emerald
    accentColor: '#047857',
    eulerApplies: false,
    funFact: 'السطح الجانبي المنحني للأسطوانة عندما يُبسط ويُفرد يتحول بدقة مدهشة إلى مستطيل عرضه هو ارتفاع الأسطوانة وطوله هو محيط الدائرة (2π نق)!',
    netDescription: 'تتكون شبكة الأسطوانة من مستطيل أبعاده (محيط الدائرة 2π نق × الارتفاع عـ) متصل بدائرتين عند طرفيه المتقابلين تمثلان القاعدتين.',
    dimensions: [
      {
        id: 'radius',
        name: 'نصف قطر القاعدة (نق)',
        symbol: 'نق',
        min: 1.5,
        max: 6,
        step: 0.5,
        defaultValue: 3,
        unit: 'سم',
      },
      {
        id: 'height',
        name: 'ارتفاع الأسطوانة (عـ)',
        symbol: 'عـ',
        min: 3,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدتان الدائريتان', shape: 'دائرة', count: 2, dimensionsDescription: 'نق = نصف القطر' },
      { name: 'السطح الجانبي', shape: 'مستطيل عند الفرد', count: 1, dimensionsDescription: 'محيط القاعدة (2π نق) × الارتفاع (عـ)' },
    ],
    calculateProperties: (dims) => {
      const r = dims.radius || 3;
      const h = dims.height || 6;
      const pi = Math.PI;
      const baseArea = pi * r * r;
      const circumference = 2 * pi * r;
      const lateralArea = circumference * h;
      const totalArea = lateralArea + 2 * baseArea;
      const volume = baseArea * h;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: 'محيط القاعدة × الارتفاع = 2 × π × نق × عـ',
        totalFormula: 'المساحة الجانبية + 2 × مساحة القاعدة = 2π نق عـ + 2π نق²',
        volumeFormula: 'مساحة القاعدة × الارتفاع = π × نق² × عـ',
        calculationSteps: [
          {
            label: 'محيط قاعدة الأسطوانة (طول شبكة المستطيل)',
            formula: '2 × π × نق',
            result: `2 × 3.1416 × ${r} = ${circumference.toFixed(1)} سم`,
          },
          {
            label: 'مساحة القاعدة الواحدة',
            formula: 'π × نق²',
            result: `3.1416 × ${r}² = ${baseArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الجانبية',
            formula: 'محيط القاعدة × الارتفاع',
            result: `${circumference.toFixed(1)} × ${h} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية',
            formula: 'المساحة الجانبية + مساحة القاعدتين',
            result: `${lateralArea.toFixed(1)} + ${(2 * baseArea).toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: 'مساحة القاعدة × الارتفاع',
            result: `${baseArea.toFixed(1)} × ${h} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  cone: {
    id: 'cone',
    nameArabic: 'المخروط الدائري القائم',
    nameEnglish: 'Right Circular Cone',
    category: 'مجسمات دورانية',
    description: 'مجسم دوراني ينتج عن دوران مثلث قائم الزاوية دورة كاملة حول أحد ضلعي القائمة، له قاعدة دائرية واحدة وقمة مدببة وسطح جانبي منحنٍ.',
    facesCount: 2,
    edgesCount: 1,
    verticesCount: 1,
    facesDescription: 'قاعدة دائرية واحدة + سطح جانبي منحنٍ (يُفرد إلى قطاع دائري)',
    color: '#f97316', // orange
    accentColor: '#c2410c',
    eulerApplies: false,
    funFact: 'حجم المخروط يساوي بدقة ثلث (⅓) حجم أسطوانة تشترك معه في نفس مساحة القاعدة ونفس الارتفاع!',
    netDescription: 'تتكون شبكة المخروط من دائرة تمثل القاعدة، وقطاع دائري يمثل السطح الجانبي بنصف قطر يساوي الراسم (الارتفاع المائل ل) وطول قوسه يساوي محيط دائرة القاعدة.',
    dimensions: [
      {
        id: 'radius',
        name: 'نصف قطر القاعدة (نق)',
        symbol: 'نق',
        min: 1.5,
        max: 6,
        step: 0.5,
        defaultValue: 3,
        unit: 'سم',
      },
      {
        id: 'height',
        name: 'الارتفاع العمودي (عـ)',
        symbol: 'عـ',
        min: 3,
        max: 10,
        step: 0.5,
        defaultValue: 5,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدة الدائرية', shape: 'دائرة', count: 1, dimensionsDescription: 'نق = نصف القطر' },
      { name: 'السطح الجانبي', shape: 'قطاع دائري', count: 1, dimensionsDescription: 'نصف قطره = الراسم (ل)، وطول قوسه = 2π نق' },
    ],
    calculateProperties: (dims) => {
      const r = dims.radius || 3;
      const h = dims.height || 5;
      const pi = Math.PI;
      // Slant height L = sqrt(r^2 + h^2)
      const slant = Math.sqrt(r * r + h * h);
      const baseArea = pi * r * r;
      const lateralArea = pi * r * slant;
      const totalArea = lateralArea + baseArea;
      const volume = (1 / 3) * baseArea * h;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: 'π × نق × الراسم (ل)',
        totalFormula: 'مساحة القاعدة + المساحة الجانبية = π نق² + π نق ل',
        volumeFormula: '⅓ × مساحة القاعدة × الارتفاع = ⅓ π نق² عـ',
        calculationSteps: [
          {
            label: 'طول الراسم / الارتفاع المائل (ل)',
            formula: '√(نق² + عـ²)',
            result: `√(${r}² + ${h}²) = ${slant.toFixed(1)} سم`,
          },
          {
            label: 'مساحة قاعدة المخروط الدائرية',
            formula: 'π × نق²',
            result: `3.1416 × ${r}² = ${baseArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الجانبية (مساحة القطاع)',
            formula: 'π × نق × ل',
            result: `3.1416 × ${r} × ${slant.toFixed(1)} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية',
            formula: 'مساحة القاعدة + المساحة الجانبية',
            result: `${baseArea.toFixed(1)} + ${lateralArea.toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: '⅓ × π × نق² × عـ',
            result: `⅓ × ${baseArea.toFixed(1)} × ${h} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },

  hexagonal_prism: {
    id: 'hexagonal_prism',
    nameArabic: 'المنشور السداسي القائم',
    nameEnglish: 'Hexagonal Prism',
    category: 'منشورات ومكعبات',
    description: 'مجسم ثلاثي الأبعاد هندسي بديع له قاعدتان سداسيتان منتظمتان ومتوازيتان، و 6 أوجه جانبية مستطيلة الشكل.',
    facesCount: 8,
    edgesCount: 18,
    verticesCount: 12,
    facesDescription: 'قاعدتان سداسيتان منتظمتان + 6 أوجه جانبية مستطيلة',
    color: '#06b6d4', // teal/cyan
    accentColor: '#0891b2',
    eulerApplies: true,
    funFact: 'خلايا النحل الطبيعية تصنعها النحل على شكل منشور سداسي لأنه الشكل الهندسي الأكفأ في استغلال المساحة وتوفير مادة الشمع!',
    netDescription: 'تتكون شبكته من شريط من 6 مستطيلات متجاورة تمثل الأوجه الجانبية، مع مضلعين سداسيين متصلين بأحد المستطيلات يمثلان القاعدتين.',
    dimensions: [
      {
        id: 'sideHex',
        name: 'طول ضلع القاعدة السداسية (ل)',
        symbol: 'ل',
        min: 2,
        max: 7,
        step: 0.5,
        defaultValue: 3.5,
        unit: 'سم',
      },
      {
        id: 'heightHex',
        name: 'ارتفاع المنشور السداسي (عـ)',
        symbol: 'عـ',
        min: 3,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: 'سم',
      },
    ],
    faceList: [
      { name: 'القاعدتان السداسيتان', shape: 'سداسي منتظم', count: 2, dimensionsDescription: 'سداسي منتظم طول ضلعه ل' },
      { name: 'الأوجه الجانبية المستطيلة', shape: 'مستطيل', count: 6, dimensionsDescription: '6 مستطيلات متطابقة أبعادها: ل × عـ' },
    ],
    calculateProperties: (dims) => {
      const s = dims.sideHex || 3.5;
      const h = dims.heightHex || 6;
      // Area of regular hexagon = (3*sqrt(3)/2) * s^2
      const hexBaseArea = ((3 * Math.sqrt(3)) / 2) * s * s;
      const hexPerimeter = 6 * s;
      const lateralArea = hexPerimeter * h;
      const totalArea = lateralArea + 2 * hexBaseArea;
      const volume = hexBaseArea * h;
      return {
        lateralArea: Number(lateralArea.toFixed(2)),
        totalArea: Number(totalArea.toFixed(2)),
        volume: Number(volume.toFixed(2)),
        lateralFormula: 'محيط السداسي × الارتفاع = 6 × ل × عـ',
        totalFormula: 'المساحة الجانبية + 2 × مساحة القاعدة السداسية',
        volumeFormula: 'مساحة القاعدة السداسية × الارتفاع',
        calculationSteps: [
          {
            label: 'محيط القاعدة السداسية',
            formula: '6 × طول الضلع',
            result: `6 × ${s} = ${hexPerimeter.toFixed(1)} سم`,
          },
          {
            label: 'مساحة القاعدة السداسية المنتظمة',
            formula: '(3√3 / 2) × ل²',
            result: `2.598 × ${s}² = ${hexBaseArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الجانبية (6 مستطيلات)',
            formula: 'محيط القاعدة × الارتفاع',
            result: `${hexPerimeter.toFixed(1)} × ${h} = ${lateralArea.toFixed(1)} سم²`,
          },
          {
            label: 'المساحة الكلية',
            formula: 'المساحة الجانبية + 2 × مساحة القاعدة',
            result: `${lateralArea.toFixed(1)} + ${(2 * hexBaseArea).toFixed(1)} = ${totalArea.toFixed(1)} سم²`,
          },
          {
            label: 'الحجم',
            formula: 'مساحة القاعدة × الارتفاع',
            result: `${hexBaseArea.toFixed(1)} × ${h} = ${volume.toFixed(1)} سم³`,
          },
        ],
      };
    },
  },
};

export const SOLIDS_LIST = Object.values(SOLIDS_DATA);
