// 헤더 및 바텀바가 모달들 overlay 에 가려지지 않는 문제를 위해 만들었습니다.
// 1. 모달 자체에는 z-52 를 줍니다.
// 2. 헤더가 가려져야 하는 모달을 사용할 때는 <ModalWrapper headerOnly={true}> 로,
// 3. 바텀바도 가려져야 하는 모달을 사용할 때는 <ModalWrapper headerOnly={false}> 로 주고 사용하시면 됩니다.
import { createPortal } from 'react-dom';

interface ModalWrapperProps {
  children: React.ReactNode;
  headerOnly?: boolean; // 헤더만 가릴지 여부
}

export default function ModalWrapper({
  children,
  headerOnly = false,
}: ModalWrapperProps) {
  if (typeof window === 'undefined') return null;

  const zIndex = headerOnly ? 'z-[51]' : 'z-[53]'; // 헤더만 or 전체 가리기

  return createPortal(
    <div className={`fixed inset-0 ${zIndex}`}>{children}</div>,
    document.body
  );
}
