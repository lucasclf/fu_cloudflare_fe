import "./page-title.css";

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <header className="page-title">
      <h1 className="page-title__heading">{title}</h1>

      {subtitle ? <p className="page-title__subtitle">{subtitle}</p> : null}
    </header>
  );
}
