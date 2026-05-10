import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const ScrolToTop = ({ children }: Props) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrolToTop;
