import React from 'react';

export interface YogaPose {
  id: string;
  nameAr: string;
  nameEn: string;
  duration: string;
  durationEn: string;
  benefitAr: string;
  benefitEn: string;
  descAr: string;
  descEn: string;
  svg: () => React.JSX.Element;
}

export const YOGA_POSES: Record<string, YogaPose[]> = {
  y1: [
    {
      id: 'y1_1',
      nameAr: 'وضعية الطفل (بالاسانا)',
      nameEn: "Child's Pose (Balasana)",
      duration: '٣ دقائق',
      durationEn: '3 mins',
      benefitAr: 'إرخاء العمود الفقري، تقليل التوتر العضلي، وضبط ريتم التنفس.',
      benefitEn: 'Alleviates spine tension, calms the mind, resets breathing.',
      descAr: 'اجلس على ركبتيك، وتباعد بينهما قليلاً. مُد جزعك وذراعيك للأمام بثبات حتى تلامس جبهتك الأرض واسترخِ بعمق.',
      descEn: 'Kneel down, sit on your heels, extend arms forward and place your forehead on the ground.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-cyan-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="75" r="5" />
          <path d="M 20 75 Q 40 45 60 65 M 60 65 L 75 82 L 95 82" />
          <path d="M 95 82 L 75 82 Q 60 82 55 72 Q 50 62 35 67" />
          <line x1="5" y1="86" x2="95" y2="86" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y1_2',
      nameAr: 'وضعية القطة والبقرة',
      nameEn: 'Cat-Cow Pose (Marjaryasana)',
      duration: '٤ دقائق',
      durationEn: '4 mins',
      benefitAr: 'ليونة الظهر، تدفئة الفقرات القطنية، وزيادة مساحة الاستنشاق.',
      benefitEn: 'Warms up the spine, improves morning core flexibility.',
      descAr: 'على أطرافك الأربعة، استنشق الهواء وقوس ظهرك لأسفل (وضعية البقرة)، ثم ازفر واقوسه للأعلى مع سحب السرة للداخل (وضعية القطة).',
      descEn: 'On hands and knees, inhale to arch your back down, exhale to round your back upward.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-rose-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(251,113,133,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="25" cy="40" r="5" />
          <path d="M 25 45 C 38 48, 52 48, 65 45" />
          <line x1="32" y1="48" x2="32" y2="80" />
          <path d="M 65 45 L 70 65 L 70 80" />
          <path d="M 68 45 Q 80 35 78 25" />
          <line x1="5" y1="84" x2="95" y2="84" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y1_3',
      nameAr: 'الكلب المتجه لأسفل',
      nameEn: 'Downward Dog (Adho Mukha)',
      duration: '٤ دقائق',
      durationEn: '4 mins',
      benefitAr: 'تمديد الجسم بالكامل، تقوية الأكتاف وتنشيط الدورة الدموية.',
      benefitEn: 'Stretches entire hamstring and spine, builds ultimate core energy.',
      descAr: 'ارفع وركيك للأعلى والخلف لتشكيل حرف V مقلوب مع الضغط بكعب القدمين نحو الأرض واسترخاء عضلات الرقبة والكتفين.',
      descEn: 'Push hips up and back, forming an inverted V-shape while grounding feet flat.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-emerald-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 50 25 L 20 80" />
          <path d="M 50 25 L 80 80" />
          <circle cx="34" cy="55" r="5" />
          <line x1="5" y1="84" x2="95" y2="84" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y1_4',
      nameAr: 'وضعية الكوبرا (بوجانغاسانا)',
      nameEn: 'Cobra Pose (Bhujangasana)',
      duration: '٤ دقائق',
      durationEn: '4 mins',
      benefitAr: 'فتح الصدر، تنشيط طاقة الرئتين، وتقوية الظهر والذراعين.',
      benefitEn: 'Opens chest cavity, stimulates core organs, strengthens back.',
      descAr: 'استلقِ تماماً على بطنك، واضغط ببطء وبثبات بكفيك بجانب الصدر لترفع جذعك للأعلى برأس مرفوع لأعلى.',
      descEn: 'Lie flat on your stomach, place hands near ribs, gently lift chest and look slightly up.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-teal-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(45,212,191,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="25" r="5" />
          <path d="M 50 30 C 52 45, 68 75, 85 80" />
          <path d="M 48 35 L 40 55 L 40 80" />
          <path d="M 85 80 L 15 80" />
          <line x1="5" y1="84" x2="95" y2="84" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    }
  ],
  y2: [
    {
      id: 'y2_1',
      nameAr: 'تحية الشمس (سوريا ناماسكار)',
      nameEn: 'Sun Salutation (Surya Namaskar)',
      duration: '٦ دقائق',
      durationEn: '6 mins',
      benefitAr: 'تحفيز حرق الطاقة والتمثيل الغذائي وتجديد طاقة الخلايا.',
      benefitEn: 'Ignites blood pathways, boosts metabolic rate and full body heat.',
      descAr: 'قف بجسم مستقيم والذراعين ممدودتين للأمام ثم ارفع يديك للسماء وانحنِ للأمام تدريجياً.',
      descEn: 'Stand tall with balanced weight, sweep hands high, fold forward, step back and flow.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-amber-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="28" r="4" />
          <path d="M 40 10 L 46 28 M 60 10 L 54 28" />
          <path d="M 50 32 L 50 60" />
          <path d="M 50 60 L 45 90 M 50 60 L 55 90" />
          <line x1="5" y1="92" x2="95" y2="92" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y2_2',
      nameAr: 'وضعية المحارب الثاني',
      nameEn: 'Warrior II (Virabhadrasana II)',
      duration: '٦ دقائق',
      durationEn: '6 mins',
      benefitAr: 'بناء الثبات والقوة في عضلات الفخذين وتنمية التوازن الاستراتيجي للجسد.',
      benefitEn: 'Builds explosive leg power, expands focus and core stability.',
      descAr: 'باعد بين قدميك بمسافة مريحة واسعة، ثم لُف قدمك الأمامية ٩٠ درجة واثنِ الركبة ومُد ذراعيك بموازاة الأرض.',
      descEn: 'Step feet wide, spin back foot 90 degrees, bend front knee, extend arms horizontally.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-orange-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="45" cy="30" r="4.5" />
          <path d="M 15 38 L 85 38" />
          <path d="M 45 34.5 L 48 60" />
          <path d="M 48 60 L 30 60 L 25 85" />
          <path d="M 48 60 L 70 85" />
          <line x1="5" y1="87" x2="95" y2="87" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y2_3',
      nameAr: 'وضعية المثلث (تريكوناسانا)',
      nameEn: 'Triangle Pose (Trikonasana)',
      duration: '٦ دقائق',
      durationEn: '6 mins',
      benefitAr: 'تمديد ممتاز للعمود الفقري والمضخات الليمفاوية بالجانبين.',
      benefitEn: 'Spine lateral stretching, opens chest cavity and promotes deep rib cage breathing.',
      descAr: 'افتح قدميك وذراعيك، انحنِ بجذعك نحو قدمك الأمامية مع رفع ذراعك الأخرى بالكامل بشكل رأسي نحو السماء.',
      descEn: 'Splay arms out, extend torso over front leg, hinge down from hip, look up toward sky hand.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-indigo-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(129,140,248,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="58" cy="40" r="4.5" />
          <path d="M 75 18 L 42 75" />
          <path d="M 42 75 L 30 85 L 80 85 Z" fill="none" />
          <line x1="5" y1="87" x2="95" y2="87" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y2_4',
      nameAr: 'وضعية نصف القمر',
      nameEn: 'Half Moon Pose (Ardha Chandrasana)',
      duration: '٧ دقائق',
      durationEn: '7 mins',
      benefitAr: 'موازنة الجملة العصبية وتقوية عضلات الكاحل والخصر الجانبي.',
      benefitEn: 'Refines neural balance, triggers profound core engagement and leg stabilization.',
      descAr: 'ارتكز بيدك الأمامية على الأرض بثقة، مع محاذاة جسمك وساقك الخلفية بمستوى موازٍ تماماً للفرشة وافتح صدرك.',
      descEn: 'Place one hand on floor, lift back leg parallel to ground, fully stack and open hips sideways.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-cyan-300 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(103,232,249,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="35" cy="45" r="4" />
          <path d="M 35 49 L 85 49" />
          <path d="M 55 49 L 55 85" />
          <path d="M 55 15 L 55 49" />
          <line x1="15" y1="87" x2="90" y2="87" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    }
  ],
  y3: [
    {
      id: 'y3_1',
      nameAr: 'وضعية ملك الحمام (كابوتاسانا)',
      nameEn: 'King Pigeon Pose (Kapotasana)',
      duration: '١٠ دقائق',
      durationEn: '10 mins',
      benefitAr: 'فتح الحوض العميق والتحرر من الضغوط المخزنة في الوركين.',
      benefitEn: 'Peak deep hip and psoas release, alleviates built up pelvic stiffness.',
      descAr: 'اثنِ ركبتك الأمامية ممدودة للجهة الأخرى، ومد رجلك الخلفية بالكامل مع ثني الركبة للإمساك بالقدم بكلتا اليدين خلف الرأس.',
      descEn: 'Lower onto front bent thigh, extend trailing leg behind. Curl back leg to hook foot in hand.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-fuchsia-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(232,121,249,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="58" cy="35" r="4.5" />
          <path d="M 58 40 Q 42 45 42 70 Q 55 82 72 82" />
          <path d="M 42 70 L 20 80 Q 15 50 25 45" />
          <path d="M 58 31 Q 48 20 35 45" />
          <line x1="5" y1="84" x2="95" y2="84" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y3_2',
      nameAr: 'الانقسام الكامل (هانوماناسانا)',
      nameEn: 'Full Split Pose (Hanumanasana)',
      duration: '١٠ دقائق',
      durationEn: '10 mins',
      benefitAr: 'الوصول لمرونة كاملة للشرايين والرباط الفخذي والوركي والتحكم المتقدم.',
      benefitEn: 'Unlocks ultimate leg split, stretches deep groin ligaments and outer hamstrings.',
      descAr: 'انزلق برجل واحدة للأمام بثبات ورجلك الأخرى للخلف بمحاذاة خط مستقيم، واجعل الحوض يلامس الأرض.',
      descEn: 'Slide forward leg front, backward leg back slowly under full core safety until hips drop.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-pink-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(244,114,182,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="25" r="4.5" />
          <path d="M 50 29.5 L 50 65" />
          <path d="M 10 80 L 90 80" />
          <path d="M 50 40 Q 55 45 50 50 Z" />
          <line x1="5" y1="82" x2="95" y2="82" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y3_3',
      nameAr: 'وضعية العجلة الكاملة',
      nameEn: 'Full Wheel Pose (Urdhva Dhanurasana)',
      duration: '١٠ دقائق',
      durationEn: '10 mins',
      benefitAr: 'زيادة تدفق الأدرينالين والنشاط، فتح كامل للصدر والفقرات الظهرية.',
      benefitEn: 'Profound full-body arch backbend, opens heart center, counteracts keyboard posture.',
      descAr: 'استلقِ على ظهرك وثبّت كفيك بجانب الأذنين، اضغط بكعب قدميك وكفيك لتدفع بجسمك بالكامل مشكلاً قنطرة منتظمة.',
      descEn: 'Lie down, place hands beside ears fingers toward shoulders, bend legs and press up smoothly.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-indigo-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(129,140,248,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 15 80 C 20 20, 80 20, 85 80" />
          <circle cx="28" cy="48" r="4.5" />
          <line x1="5" y1="84" x2="95" y2="84" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y3_4',
      nameAr: 'وضعية حورية البحر',
      nameEn: 'Mermaid Pose (Eka Pada Kopin)',
      duration: '١٠ دقائق',
      durationEn: '10 mins',
      benefitAr: 'دمج مرونة الكتفين والأكواع وعضلات الأرداف في وضعية انسيابية فائقة الجمال.',
      benefitEn: 'Elegant backbend stretch that integrates high pelvic and shoulder mobility.',
      descAr: 'من وضعية الحمام، تفاد السحب القوي واثنِ قدمك الخلفية لتشبك في باطن كوعك لتقفل مع اليد الأخرى خلف الكتف.',
      descEn: 'From pigeon, secure trailing foot inside same-side elbow, raise outside arm to clasp hands behind.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-rose-455 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(251,113,133,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="62" cy="35" r="4" />
          <path d="M 62 39 Q 45 42 40 75" />
          <path d="M 40 75 Q 60 75 75 80" />
          <path d="M 43 75 L 20 80 Q 25 55 35 50" />
          <path d="M 62 31 Q 50 18 35 50" />
        </svg>
      )
    }
  ],
  y4: [
    {
      id: 'y4_1',
      nameAr: 'وضعية التأمل اللوتس (بادماسانا)',
      nameEn: 'Lotus Meditation (Padmasana)',
      duration: '٥ دقائق',
      durationEn: '5 mins',
      benefitAr: 'تهدئة عميقة لموجات الدماغ والمساهمة في الاستغراق في النوم السريع والآمن.',
      benefitEn: 'Calms synaptic firing, reduces heartbeat, locks core grounding for restful sleep.',
      descAr: 'اجلس بظهر وقوام مستقيمين، ضع كاحل قدمك فوق الفخذ الآخر بالتناوب، وأرح كفي يديك على الركبتين وتنفس بنعومة.',
      descEn: 'Sit tall, overlap feet onto opposing thighs, keep spine elegantly upright, feel gravity.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-emerald-300 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(110,231,183,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="25" r="5" />
          <line x1="50" y1="30" x2="50" y2="65" />
          <path d="M 32 45 Q 20 60 20 75" />
          <path d="M 68 45 Q 80 60 80 75" />
          <path d="M 20 75 C 30 85, 70 85, 80 75 C 70 65, 30 65, 20 75 Z" />
        </svg>
      )
    },
    {
      id: 'y4_2',
      nameAr: 'وضعية الفراشة (بادا كوناسانا)',
      nameEn: 'Butterfly Pose (Baddha Konasana)',
      duration: '٥ دقائق',
      durationEn: '5 mins',
      benefitAr: 'تخفيف التشنج في أربطة الفخذين المتوترة نتيجة الجلوس الطويل.',
      benefitEn: 'Gently releases accumulated tightness in structural pelvic and lower back joints.',
      descAr: 'اجلس وقرّب باطني قدميك أمامك ممسكاً بهما برفق، باعد ركبتيك في اتجاه الأرض وانحنِ للأمام بنعومة وسكينة.',
      descEn: 'Extend knees wide outward, join soles of feet together, grip toes, inhale and fold softly.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-sky-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="48" cy="38" r="4.5" />
          <path d="M 48 42.5 L 50 72" />
          <path d="M 50 72 C 30 65, 20 80, 50 82 C 80 80, 70 65, 50 72 Z" />
          <path d="M 48 42.5 Q 35 55 50 82" />
        </svg>
      )
    },
    {
      id: 'y4_3',
      nameAr: 'وضعية الجسر المدعوم',
      nameEn: 'Supported Bridge Pose (Setu Bandha)',
      duration: '٥ دقائق',
      durationEn: '5 mins',
      benefitAr: 'تخفيف توتر الكتفين ومحاذاة الرقبة وزفر الضغوط المتراكمة.',
      benefitEn: 'Restores nervous balance, gently massages the spine and neck muscles.',
      descAr: 'استلقِ على ظهرك تماماً، اثنِ ركبتك مع المباعدة بينهما، ثم ارفع وركيك برفق نحو الأعلى مع إبقاء الكتفين واليدين مثبتين.',
      descEn: 'Lie down flat, place feet near hips, push upward to elevate hips, keep arms grounded flat.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-purple-400 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="78" r="4.5" />
          <path d="M 20 82 L 32 82 Q 55 45 72 82" />
          <line x1="32" y1="82" x2="65" y2="82" />
          <line x1="5" y1="84" x2="95" y2="84" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'y4_4',
      nameAr: 'رفع الساقين على الحائط (فيباريتا)',
      nameEn: 'Legs-Up-the-Wall (Viparita Karani)',
      duration: '٥ دقائق',
      durationEn: '5 mins',
      benefitAr: 'تنشيط الدورة الدموية العكسية، لتجاوز التعب وإراحة القلب والأبهر.',
      benefitEn: 'Boosts calming lymphatic flow, deeply relaxes tired legs, invites physical surrender.',
      descAr: 'استلقِ بمحاذاة حائط، مّد ساقيك للأعلى رأسياً مستندتين على الجدار بمحاذاة حوضك لامتصاص آثار التعب لتسترخي الساقين.',
      descEn: 'Align your hips flat near a wall, raise legs straight upward vertically, rest hands outwards.',
      svg: () => (
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] stroke-teal-300 fill-none stroke-[2.5] drop-shadow-[0_0_12px_rgba(20,184,166,0.5)]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="80" r="4.5" />
          <path d="M 20 80 L 68 80" />
          <path d="M 68 80 L 68 25" />
          <path d="M 35 80 Q 40 70 45 80" />
          <line x1="72" y1="18" x2="72" y2="88" stroke="white" strokeWidth="0.5" opacity="0.2" />
          <line x1="5" y1="85" x2="95" y2="85" stroke="gray" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    }
  ]
};
