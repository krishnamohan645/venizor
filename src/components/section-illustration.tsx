export type ArtworkKind =
  | "architecture"
  | "payments"
  | "operations"
  | "retrieval"
  | "commerce"
  | "tools"
  | "connections"
  | "intelligence"
  | "data"
  | "delivery"
  | "security"
  | "discovery"
  | "health"
  | "education"
  | "property"
  | "services"
  | "logistics"
  | "idea"
  | "vision";

/** Original vector compositions. Each subject has its own silhouette and detail. */
export function SectionIllustration({
  kind,
  className = "",
}: {
  kind: ArtworkKind;
  className?: string;
}) {
  const blue = "var(--blue)",
    pale = "var(--surface-blue)",
    line = "var(--rule)",
    white = "var(--white)";
  return (
    <div
      className={`section-illustration illustration-${kind} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 600 420" fill="none">
        <path d="M45 350H555M65 375H535" stroke={line} strokeWidth="1" />
        <ellipse
          cx="305"
          cy="348"
          rx="192"
          ry="18"
          fill={blue}
          opacity=".045"
        />
        {kind === "architecture" || kind === "property" ? (
          <g className="illustration-float">
            <path d="m75 294 250-97 220 98-239 91Z" fill="#e5eaf1" />
            <path
              d="m123 177 173-71 190 68-172 74Z"
              fill={white}
              stroke={line}
            />
            <path
              d="m123 177 191 71v103l-191-72Z"
              fill="#f4f2ee"
              stroke="#d6d9df"
            />
            <path
              d="m314 248 172-74v103l-172 74Z"
              fill="#dce8fc"
              stroke="#c2d1ec"
            />
            <path d="m137 191 161 60v79l-161-60Z" fill="#fdfcf9" />
            <path d="m174 283 0-48c0-35 55-15 55 20v49Z" fill={blue} />
            <path d="m246 238 37 14v56l-37-14Z" fill="#dce4ed" />
            <path d="m335 256 133-57v65l-133 57Z" fill="#b7cff4" />
            <path
              d="m354 249 0 65m38-81v65m38-82v65"
              stroke={white}
              strokeWidth="4"
            />
            <path
              d="m123 177 173-71 190 68M296 106v27l-111 45"
              stroke="#bcc8d8"
            />
            <path d="m296 133 131 46-113 47-129-48Z" fill={pale} />
            <path d="M102 310v-77" stroke="#889b8a" strokeWidth="4" />
            <ellipse cx="102" cy="222" rx="26" ry="41" fill="#dbe5df" />
            <path d="m102 224-12-18m12 36 14-23" stroke="#b3c6bb" />
            <circle cx="487" cy="92" r="25" fill="#e8eefb" />
            <path d="M68 155h35m-18-17v35" stroke={line} />
          </g>
        ) : kind === "payments" ? (
          <g className="illustration-float">
            <path d="m147 311 245-28 78 33-245 32Z" fill="#dfe8fa" />
            <g transform="rotate(-9 300 205)">
              <rect
                x="203"
                y="52"
                width="192"
                height="304"
                rx="28"
                fill={white}
                stroke="#b8c9e4"
                strokeWidth="2"
              />
              <rect
                x="215"
                y="65"
                width="168"
                height="278"
                rx="19"
                fill={pale}
              />
              <rect
                x="267"
                y="71"
                width="65"
                height="7"
                rx="3.5"
                fill="#c4d0e2"
              />
              <text x="235" y="112" fill="#586679" fontSize="11">
                EVERYDAY
              </text>
              <circle
                cx="299"
                cy="181"
                r="49"
                stroke="#d6e0f4"
                strokeWidth="17"
              />
              <path
                d="M299 132a49 49 0 1 1-46 66"
                stroke={blue}
                strokeWidth="17"
                strokeLinecap="round"
              />
              <path
                d="m284 185 10 10 22-27"
                stroke={blue}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="233"
                y="255"
                width="132"
                height="32"
                rx="8"
                fill={white}
              />
              <circle cx="250" cy="271" r="7" fill="#dce6ff" />
              <path d="M268 267h70m-70 8h42" stroke="#a8b9d2" strokeWidth="3" />
              <rect
                x="233"
                y="295"
                width="132"
                height="29"
                rx="8"
                fill={white}
              />
              <path d="M248 310h89" stroke="#bfcde2" strokeWidth="3" />
            </g>
            <g transform="rotate(8 425 250)">
              <rect
                x="360"
                y="208"
                width="140"
                height="89"
                rx="12"
                fill={blue}
              />
              <path
                d="M379 230h23m-23 38h46m12 0h12"
                stroke={white}
                strokeWidth="3"
                opacity=".7"
              />
              <circle cx="471" cy="235" r="10" fill={white} opacity=".2" />
            </g>
          </g>
        ) : kind === "operations" ? (
          <g className="illustration-float">
            <ellipse
              cx="301"
              cy="229"
              rx="204"
              ry="104"
              stroke="#cbd8ef"
              transform="rotate(-15 301 229)"
            />
            <ellipse
              cx="301"
              cy="229"
              rx="157"
              ry="69"
              stroke="#d8e2f2"
              transform="rotate(16 301 229)"
            />
            {[
              { x: 137, y: 194, h: 87 },
              { x: 235, y: 136, h: 144 },
              { x: 334, y: 173, h: 108 },
            ].map((b, i) => (
              <g key={b.x}>
                <path
                  d={`m${b.x} ${b.y} 61-26 46 24-61 26Z`}
                  fill={i === 1 ? blue : white}
                  stroke={i === 1 ? blue : line}
                />
                <path
                  d={`m${b.x} ${b.y} 46 24v${b.h}l-46-24Z`}
                  fill={i === 1 ? "#3769ee" : "#eef2fa"}
                  stroke={line}
                />
                <path
                  d={`m${b.x + 46} ${b.y + 24} 61-26v${b.h}l-61 26Z`}
                  fill={i === 1 ? "#1740b6" : "#dce7fb"}
                  stroke={line}
                />
              </g>
            ))}
            <circle cx="111" cy="261" r="9" fill={blue} />
            <circle cx="480" cy="166" r="7" fill={blue} />
            <circle cx="410" cy="318" r="6" fill="#a8bff6" />
            <path d="M90 110h55m-28-28v56" stroke={line} />
          </g>
        ) : kind === "retrieval" ||
          kind === "connections" ||
          kind === "services" ? (
          <g className="illustration-float">
            <path
              d="M167 128h84v84h118v77h73"
              stroke="#9bb5ee"
              strokeWidth="2"
              strokeDasharray="5 6"
            />
            <g transform="rotate(-10 225 200)">
              <rect
                x="128"
                y="97"
                width="164"
                height="219"
                rx="10"
                fill={white}
                stroke={line}
              />
              <rect x="149" y="120" width="45" height="9" rx="3" fill={blue} />
              <path
                d="M149 154h117m-117 16h96m-96 32h117m-117 16h117m-117 16h76m-76 32h117"
                stroke="#c6d2e4"
                strokeWidth="4"
              />
              <rect
                x="147"
                y="197"
                width="120"
                height="43"
                rx="3"
                fill={blue}
                opacity=".09"
              />
            </g>
            <g transform="rotate(8 378 220)">
              <rect
                x="305"
                y="132"
                width="157"
                height="199"
                rx="10"
                fill={white}
                stroke={line}
              />
              <path
                d="M329 164h74m-74 16h111m-111 16h100m-100 53h106m-106 17h89m-89 17h100"
                stroke="#bacce6"
                strokeWidth="4"
              />
              <rect x="328" y="212" width="51" height="11" rx="3" fill={blue} />
            </g>
            <circle cx="296" cy="199" r="37" fill={blue} />
            <path
              d="m280 199 10 10 21-23"
              stroke={white}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="476" cy="108" r="16" stroke="#b8ccf2" />
            <path d="M476 101v14m-7-7h14" stroke={blue} />
          </g>
        ) : kind === "commerce" ? (
          <g className="illustration-float">
            <path d="m126 291 145-48 185 53-143 52Z" fill="#dae6fd" />
            <path d="m126 291 187 57v27l-187-55Z" fill="#c7d9fc" />
            <path d="m313 348 143-52v27l-143 52Z" fill="#b5cdf7" />
            <path
              d="M181 173c0 54 12 102 63 102s63-48 63-102Z"
              fill="#f4f1ea"
              stroke="#d5d3ce"
            />
            <ellipse
              cx="244"
              cy="173"
              rx="63"
              ry="22"
              fill="#e3ded5"
              stroke="#d5d3ce"
            />
            <ellipse cx="244" cy="173" rx="47" ry="13" fill="#fcfaf6" />
            <path d="M313 226c0 33 9 65 43 65s43-32 43-65Z" fill={blue} />
            <ellipse cx="356" cy="226" rx="43" ry="15" fill="#517df4" />
            <ellipse cx="356" cy="226" rx="31" ry="9" fill="#c4d5ff" />
            <path
              d="M430 263v-99m0 36c-40-4-54-30-48-48 30 0 47 16 48 48Zm0 21c36-5 51-27 48-45-27-2-43 16-48 45Z"
              fill="#d2ded6"
              stroke="#a6beb0"
            />
            <path d="m413 263 9 36h21l9-36Z" fill="#ede9e0" stroke="#d6d4cc" />
            <path d="M103 100h68m-34-34v68" stroke={line} />
            <circle cx="460" cy="83" r="22" fill={pale} />
          </g>
        ) : kind === "tools" || kind === "vision" ? (
          <g className="illustration-float">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(0 ${i * 52})`}>
                <path
                  d="m134 172 172-77 171 77-171 78Z"
                  fill={i === 0 ? white : i === 1 ? "#dce7ff" : blue}
                  stroke={i === 2 ? blue : line}
                />
                <path
                  d="m134 172 172 78 171-78v17l-171 78-172-78Z"
                  fill={i === 0 ? "#eef2fa" : i === 1 ? "#c0d2fc" : "#1643c5"}
                  stroke={line}
                />
              </g>
            ))}
            <path
              d="m272 144-24 14 24 14m66-28 24 14-24 14m-29-34-12 41"
              stroke={blue}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M468 69v35m-17-18h35M100 289v23m-12-11h24"
              stroke="#a9bff1"
            />
          </g>
        ) : kind === "data" ? (
          <g className="illustration-float">
            {[
              { x: 164, y: 155, w: 105, h: 128 },
              { x: 281, y: 105, w: 132, h: 171 },
              { x: 404, y: 212, w: 75, h: 90 },
            ].map((c, i) => (
              <g key={c.x}>
                <path
                  d={`M${c.x - c.w / 2} ${c.y}v${c.h}c0 31 ${c.w} 31 ${c.w} 0v-${c.h}`}
                  fill={i === 1 ? "#dce7ff" : white}
                  stroke="#b8cae8"
                />
                <ellipse
                  cx={c.x}
                  cy={c.y}
                  rx={c.w / 2}
                  ry={22}
                  fill={i === 1 ? blue : pale}
                  stroke="#b8cae8"
                />
                <path
                  d={`M${c.x - c.w / 2} ${c.y + 48}c0 31 ${c.w} 31 ${c.w} 0M${c.x - c.w / 2} ${c.y + 87}c0 31 ${c.w} 31 ${c.w} 0`}
                  stroke="#b8cae8"
                />
              </g>
            ))}
          </g>
        ) : kind === "security" || kind === "health" ? (
          <g className="illustration-float">
            <path
              d="m300 64 128 47v86c0 70-47 124-128 156-81-32-128-86-128-156v-86Z"
              fill={white}
              stroke="#b8cae8"
              strokeWidth="2"
            />
            <path d="m300 89 103 38v70c0 56-36 100-103 131Z" fill={pale} />
            {kind === "health" ? (
              <path
                d="M282 150h36v42h42v36h-42v42h-36v-42h-42v-36h42Z"
                fill={blue}
              />
            ) : (
              <>
                <rect
                  x="254"
                  y="179"
                  width="92"
                  height="77"
                  rx="12"
                  fill={blue}
                />
                <path
                  d="M272 179v-20a28 28 0 0 1 56 0v20"
                  stroke={blue}
                  strokeWidth="9"
                />
                <circle cx="300" cy="211" r="8" fill={white} />
                <path d="M300 216v14" stroke={white} strokeWidth="4" />
              </>
            )}
            <circle cx="145" cy="288" r="15" stroke="#a9bff1" />
            <circle cx="457" cy="106" r="9" fill="#d8e5ff" />
          </g>
        ) : kind === "delivery" || kind === "logistics" ? (
          <g className="illustration-float">
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${i * 80} ${-i * 37})`}>
                <path
                  d="m119 271 62-28 57 27-61 29Z"
                  fill={i === 3 ? blue : white}
                  stroke={line}
                />
                <path
                  d="m119 271 58 28v43l-58-29Z"
                  fill={i === 3 ? "#3769ee" : "#edf2fa"}
                  stroke={line}
                />
                <path
                  d="m177 299 61-29v43l-61 29Z"
                  fill={i === 3 ? "#1740b6" : "#cfddf6"}
                  stroke={line}
                />
              </g>
            ))}
            <path
              d="m149 207 235-111m-46-4 46 4-20 41"
              stroke={blue}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ) : kind === "discovery" ? (
          <g className="illustration-float">
            <rect
              x="132"
              y="130"
              width="264"
              height="177"
              rx="12"
              fill={white}
              stroke={line}
            />
            <path
              d="M155 161h218m-218 41h168m-168 19h190m-190 19h113m-113 32h162"
              stroke="#c3d2e9"
              strokeWidth="5"
            />
            <circle
              cx="354"
              cy="192"
              r="68"
              fill={pale}
              fillOpacity=".8"
              stroke={blue}
              strokeWidth="10"
            />
            <path
              d="m402 241 66 68"
              stroke={blue}
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="m329 194 17 17 34-39"
              stroke={blue}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ) : kind === "education" ? (
          <g className="illustration-float">
            <path d="m300 135 0 191-152-45V90Z" fill={white} stroke={line} />
            <path d="m300 135 152-45v191l-152 45Z" fill={pale} stroke={line} />
            <path
              d="m176 135 98 29m-98 0 98 29m-98 0 98 29m-98 0 65 19m86-81 98-29m-98 58 98-29m-98 58 98-29"
              stroke="#b3c7eb"
              strokeWidth="4"
            />
            <path d="m312 91 57-18v87l-28-12-29 31Z" fill={blue} />
          </g>
        ) : (
          <g className="illustration-float">
            <circle cx="300" cy="209" r="106" fill={pale} stroke={line} />
            {Array.from({ length: 10 }, (_, i) => (
              <ellipse
                key={i}
                cx="300"
                cy="209"
                rx="55"
                ry="126"
                stroke={blue}
                strokeOpacity=".5"
                transform={`rotate(${i * 18} 300 209)`}
              />
            ))}
            <circle cx="300" cy="209" r="35" fill={blue} />
            <path d="m289 209 8 8 16-19" stroke={white} strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
}
