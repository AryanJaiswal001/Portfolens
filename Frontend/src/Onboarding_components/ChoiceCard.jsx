export default function ChoiceCard({
    icon:Icon,
    title,
    description,
    meta,
    ctaLabel,
    onClick,
    highlighted=false,
}){
    return (
      <div
        className="relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: highlighted
            ? "var(--accent-purple)"
            : "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
          minHeight: "400px",
        }}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/**Recommended badge*/}
        {highlighted && (
          <div className="absolute top-4 right-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "var(--gradient-text)",
                color: "var(--text-inverse)",
              }}
            >
              Recommended
            </span>
          </div>
        )}

        {/**Icon*/}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: highlighted ? "var(--gradient-bg)" : "var(--bg-app)",
              border: "2px solid",
              borderColor: "var(--border-subtle)",
            }}
          >
            <Icon
              className="w-8 h-8"
              style={{
                color: "var(--accent-purple)",
              }}
            />
          </div>
        </div>

        {/**Content-Flex grow to push button down */}
        <div className="flex flex-col grow text-center">
          {/**Title*/}
          <h3
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          {/**Description*/}
          <p
            className="text-base mb-4 leading-relaxed"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            {description}
          </p>
          {/**Meta*/}
          {meta && (
            <p
              className="text-sm mb-auto"
              style={{ color: "var(--text-tertiary)" }}
            >
              {meta}
            </p>
          )}
        </div>

        {/**CTA Button*/}
        <button
          className="w-full py-3 rounded-lg font-semibold transition-transform hover:scale-105 mt-6"
          style={{
            background: highlighted
              ? "var(--bg-button-primary)"
              : "var(--bg-button-secondary)",
            color: highlighted ? "var(--text-inverse)" : "var(--text-primary)",
            border: highlighted ? "none" : "2px solid var(--border-medium)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {ctaLabel}
        </button>
      </div>
    );
}