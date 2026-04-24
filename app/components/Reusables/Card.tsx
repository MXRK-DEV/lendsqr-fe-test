import Image from "next/image";
import { clsx } from "clsx";
import styles from "../reusablescssmodules/Card.module.scss";

interface InfoCardProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
  value: string | number;
  className?: string;
}

export const InfoCard = ({
  imageSrc,
  imageAlt,
  label,
  value,
  className = "",
}: InfoCardProps) => {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.cardInner}>
        <Image src={imageSrc} alt={imageAlt} width={40} height={40} priority />
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};
