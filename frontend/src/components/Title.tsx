export default function Title({ text1, text2 }: { text1: string; text2: string }) {
  return (
    <h2 className="section-title inline">
      {text1} <span className="text-orange-600">{text2}</span>
    </h2>
  );
}