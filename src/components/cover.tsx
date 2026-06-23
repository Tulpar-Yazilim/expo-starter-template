import { useColorScheme } from 'nativewind';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

export const Cover = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  const blob = dark ? '#1E3A5F' : '#E0F2FE';
  const screen = dark ? '#0F172A' : '#F8FAFC';
  const cardBg = dark ? '#1E293B' : '#ffffff';
  const rowGreen = dark ? '#052E16' : '#F0FDF4';
  const rowAmber = dark ? '#422006' : '#FFFBEB';
  const rowBlue = dark ? '#172554' : '#EFF6FF';
  const rowRed = dark ? '#450A0A' : '#FEF2F2';
  const chartBg = dark ? '#082F49' : '#F0F9FF';
  const checkCircle = dark ? '#0C4A6E' : '#E0F2FE';
  const dollarCircle = dark ? '#2E1065' : '#EDE9FE';
  const textLine = dark ? '#475569' : '#E2E8F0';
  const groundLine = dark ? '#334155' : '#E2E8F0';
  const diamond = dark ? '#94A3B8' : '#64748B';

  return (
    <Svg viewBox="0 0 360 310" {...props}>
      {/* Background blobs */}
      <Circle cx="305" cy="42" r="68" fill={blob} opacity="0.55" />
      <Circle cx="55" cy="272" r="52" fill={blob} opacity="0.45" />

      {/* ── TATTOO MACHINE (left) ── */}
      {/* Frame housing */}
      <Rect x="36" y="88" width="46" height="38" rx="7" fill="#1E293B" />
      {/* Coil stack */}
      <Ellipse cx="59" cy="98" rx="17" ry="6" fill="#334155" />
      <Ellipse cx="59" cy="106" rx="17" ry="6" fill="#2D3A4A" />
      <Ellipse cx="59" cy="114" rx="17" ry="6" fill="#334155" />
      {/* Power post */}
      <Rect x="76" y="93" width="9" height="14" rx="3" fill="#0891B2" />
      {/* Handle grip */}
      <Rect x="44" y="124" width="30" height="88" rx="8" fill="#374151" />
      <Path
        d="M48 137 L70 137"
        stroke="#4B5563"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M48 148 L70 148"
        stroke="#4B5563"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M48 159 L70 159"
        stroke="#4B5563"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M48 170 L70 170"
        stroke="#4B5563"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M48 181 L70 181"
        stroke="#4B5563"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Needle tube */}
      <Rect x="56" y="210" width="6" height="36" rx="3" fill="#6B7280" />
      {/* Needle tip */}
      <Path d="M56 244 L59 258 L62 244 Z" fill="#9CA3AF" />
      {/* Power cord */}
      <Path
        d="M44 102 Q20 102 16 72 Q12 46 34 40"
        stroke="#374151"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <Rect x="28" y="34" width="13" height="9" rx="2.5" fill="#4B5563" />

      {/* ── CENTRAL PHONE ── */}
      {/* Drop shadow */}
      <Rect
        x="133"
        y="37"
        width="100"
        height="204"
        rx="16"
        fill="#000"
        opacity="0.1"
      />
      {/* Frame */}
      <Rect x="130" y="33" width="100" height="204" rx="16" fill="#1E293B" />
      {/* Screen */}
      <Rect x="138" y="47" width="84" height="172" rx="9" fill={screen} />
      {/* Notch */}
      <Rect x="159" y="37" width="42" height="10" rx="5" fill="#0F172A" />
      {/* Home indicator */}
      <Rect x="158" y="229" width="44" height="4" rx="2" fill="#334155" />

      {/* Screen header */}
      <Rect x="138" y="47" width="84" height="23" rx="9" fill="#0891B2" />
      <Rect x="138" y="60" width="84" height="10" fill="#0891B2" />
      <Rect
        x="143"
        y="52"
        width="10"
        height="10"
        rx="2"
        fill="white"
        opacity="0.25"
      />
      <Rect
        x="157"
        y="53"
        width="38"
        height="5"
        rx="2.5"
        fill="white"
        opacity="0.6"
      />
      <Rect
        x="157"
        y="62"
        width="25"
        height="4"
        rx="2"
        fill="white"
        opacity="0.35"
      />

      {/* Appointment row 1 – confirmed */}
      <Rect x="142" y="76" width="76" height="19" rx="5" fill={rowGreen} />
      <Circle cx="151" cy="85.5" r="4.5" fill="#22C55E" />
      <Rect x="158" y="81" width="34" height="4.5" rx="2.25" fill="#BBF7D0" />
      <Rect x="158" y="89" width="22" height="3.5" rx="1.75" fill="#D1FAE5" />
      <Rect
        x="209"
        y="79"
        width="7"
        height="7"
        rx="2"
        fill="#22C55E"
        opacity="0.6"
      />

      {/* Appointment row 2 – pending */}
      <Rect x="142" y="99" width="76" height="19" rx="5" fill={rowAmber} />
      <Circle cx="151" cy="108.5" r="4.5" fill="#F59E0B" />
      <Rect x="158" y="104" width="28" height="4.5" rx="2.25" fill="#FDE68A" />
      <Rect x="158" y="112" width="18" height="3.5" rx="1.75" fill="#FEF3C7" />
      <Rect
        x="209"
        y="102"
        width="7"
        height="7"
        rx="2"
        fill="#F59E0B"
        opacity="0.6"
      />

      {/* Appointment row 3 – confirmed (blue) */}
      <Rect x="142" y="122" width="76" height="19" rx="5" fill={rowBlue} />
      <Circle cx="151" cy="131.5" r="4.5" fill="#3B82F6" />
      <Rect x="158" y="127" width="36" height="4.5" rx="2.25" fill="#BFDBFE" />
      <Rect x="158" y="135" width="26" height="3.5" rx="1.75" fill="#DBEAFE" />
      <Rect
        x="209"
        y="125"
        width="7"
        height="7"
        rx="2"
        fill="#3B82F6"
        opacity="0.6"
      />

      {/* Appointment row 4 – cancelled */}
      <Rect x="142" y="145" width="76" height="19" rx="5" fill={rowRed} />
      <Circle cx="151" cy="154.5" r="4.5" fill="#EF4444" />
      <Rect x="158" y="150" width="24" height="4.5" rx="2.25" fill="#FECACA" />
      <Rect x="158" y="158" width="16" height="3.5" rx="1.75" fill="#FEE2E2" />
      <Rect
        x="209"
        y="148"
        width="7"
        height="7"
        rx="2"
        fill="#EF4444"
        opacity="0.6"
      />

      {/* Mini bar chart */}
      <Rect x="142" y="169" width="76" height="42" rx="5" fill={chartBg} />
      <Rect
        x="149"
        y="185"
        width="8"
        height="18"
        rx="2"
        fill="#0891B2"
        opacity="0.65"
      />
      <Rect x="160" y="180" width="8" height="23" rx="2" fill="#0891B2" />
      <Rect
        x="171"
        y="183"
        width="8"
        height="20"
        rx="2"
        fill="#0891B2"
        opacity="0.8"
      />
      <Rect x="182" y="176" width="8" height="27" rx="2" fill="#0891B2" />
      <Rect
        x="193"
        y="182"
        width="8"
        height="21"
        rx="2"
        fill="#0891B2"
        opacity="0.85"
      />
      <Rect
        x="204"
        y="186"
        width="7"
        height="17"
        rx="2"
        fill="#0891B2"
        opacity="0.6"
      />

      {/* ── RIGHT CARD 1: Appointment stats ── */}
      <Rect
        x="249"
        y="75"
        width="94"
        height="66"
        rx="13"
        fill="#000"
        opacity="0.07"
      />
      <Rect x="247" y="72" width="94" height="66" rx="13" fill={cardBg} />
      <Rect x="247" y="72" width="94" height="10" rx="13" fill="#0891B2" />
      <Rect x="247" y="78" width="94" height="4" fill="#0891B2" />
      <Circle cx="266" cy="103" r="11" fill={checkCircle} />
      <Path
        d="M261 103 L264.5 106.5 L271 98"
        stroke="#0891B2"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x="282" y="97" width="48" height="5.5" rx="2.75" fill={textLine} />
      <Rect x="282" y="106" width="34" height="4.5" rx="2.25" fill={textLine} />
      <Rect x="253" y="120" width="78" height="13" rx="5" fill="#0891B2" />
      <Rect x="260" y="124" width="64" height="5" rx="2.5" fill="#BAE6FD" />

      {/* ── RIGHT CARD 2: Commission ── */}
      <Rect
        x="259"
        y="153"
        width="84"
        height="62"
        rx="13"
        fill="#000"
        opacity="0.07"
      />
      <Rect x="257" y="150" width="84" height="62" rx="13" fill={cardBg} />
      <Rect x="257" y="150" width="84" height="10" rx="13" fill="#7C3AED" />
      <Rect x="257" y="156" width="84" height="4" fill="#7C3AED" />
      <Circle cx="275" cy="180" r="10" fill={dollarCircle} />
      <Path
        d="M275 175 L275 185"
        stroke="#7C3AED"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M272 177 Q275 175.5 278 177 Q281 179 275 180.5 Q269 182 272 184 Q275 185.5 278 184"
        stroke="#7C3AED"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Rect x="289" y="175" width="40" height="5.5" rx="2.75" fill={textLine} />
      <Rect x="289" y="184" width="28" height="4.5" rx="2.25" fill={textLine} />
      <Rect x="263" y="198" width="68" height="10" rx="4" fill="#7C3AED" />
      <Rect x="270" y="201" width="54" height="4" rx="2" fill="#C4B5FD" />

      {/* ── DECORATIVE ── */}
      {/* Stars */}
      <Path
        d="M322 46 L324 53 L331 53 L325.5 57.5 L327.5 64.5 L322 60.5 L316.5 64.5 L318.5 57.5 L313 53 L320 53 Z"
        fill="#FCD34D"
      />
      <Path
        d="M20 148 L21.5 153 L27 153 L22.5 156 L24 161 L20 158 L16 161 L17.5 156 L13 153 L18.5 153 Z"
        fill="#FCD34D"
      />
      <Path
        d="M338 252 L339.5 257 L345 257 L340.5 260 L342 265 L338 262 L334 265 L335.5 260 L331 257 L336.5 257 Z"
        fill="#FCD34D"
      />

      {/* Scatter dots */}
      <Circle cx="100" cy="52" r="4.5" fill="#0891B2" opacity="0.25" />
      <Circle cx="112" cy="66" r="3" fill="#0891B2" opacity="0.18" />
      <Circle cx="88" cy="70" r="2.5" fill="#0891B2" opacity="0.15" />

      {/* Ink drop */}
      <Path
        d="M20 200 Q20 190 25 184 Q30 178 35 184 Q40 190 35 200 Q30 210 25 208 Q20 206 20 200 Z"
        fill="#0891B2"
        opacity="0.12"
      />

      {/* Geometric diamond tattoo flash */}
      <Path
        d="M344 232 L357 250 L344 268 L331 250 Z"
        stroke={diamond}
        strokeWidth="1.5"
        fill="none"
        opacity="0.35"
      />
      <Path
        d="M344 241 L351 250 L344 259 L337 250 Z"
        stroke={diamond}
        strokeWidth="1"
        fill="none"
        opacity="0.35"
      />

      {/* Notification badge */}
      <Circle cx="224" cy="44" r="12" fill="#EF4444" />
      <Rect x="220" y="40" width="8" height="5.5" rx="1.5" fill="white" />
      <Rect x="222.5" y="47.5" width="3" height="3" rx="1.5" fill="white" />

      {/* Ground line */}
      <Path
        d="M35 292 L325 292"
        stroke={groundLine}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};
