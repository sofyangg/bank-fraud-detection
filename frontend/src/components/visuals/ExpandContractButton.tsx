interface ChildProps {
  onToggleExpand: (chartId: string) => void;
  id: string;
  IsExpanded: string|null;
}
const buttonStyle: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 50,
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
};

export default function ExConButton({ onToggleExpand, id,IsExpanded }: ChildProps) {
    return(<button
              onClick={ () =>onToggleExpand(id)}
              style={buttonStyle}
            >
              {IsExpanded === id ? "✕ Minimize" : "⤢ Expand"}
            </button>)
}