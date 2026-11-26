export function useElementSize<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [setElement, size] as const;
}


-import { useElementWidth } from '@/hooks/useElementWidth';
+import { useElementSize } from '@/hooks/useElementSize';

-const HEIGHT = 230;

-const [chartRef, width] = useElementWidth<HTMLDivElement>();
+const [chartRef, { width, height }] = useElementSize<HTMLDivElement>();

-const baseline = HEIGHT - BOTTOM_SPACE;
+const baseline = height - BOTTOM_SPACE;

-{width > 0 && (
-  <svg width={width} height={HEIGHT} ...>
+{width > 0 && height > 0 && (
+  <svg width={width} height={height} ...>

-y={HEIGHT - 8}
+y={height - 8}



  +/* On a computer the page fills the screen */
+@media (min-width: 768px) {
+  .dash-page {
+    grid-template-rows: auto 1fr;
+    min-height: calc(100dvh - var(--layout-header-height) - 2 * var(--layout-content-padding));
+  }
+}

 .dash-layout {
+  align-content: start;
   ...
 }
 @container dash-page (min-width: 1100px) {
   .dash-layout {
-    align-items: start;
+    align-content: stretch;
   }
 }

 .dash-main {
-  display: grid;
+  display: flex;
+  flex-direction: column;
 }

 .dash-insights {
+  flex: 1 1 auto;   /* this row takes the free height */
 }

+.dash-activity.ant-card,
+.dash-orders.ant-card { height: 100%; }
+.dash-activity .ant-card-body { display: flex; flex-direction: column; height: 100%; }

 .dash-activity__chart {
+  flex: 1 1 auto;
+  min-height: 200px;
+  position: relative;
 }
 .dash-activity__chart svg {
+  inset: 0;
+  position: absolute;   /* the drawing never makes the card taller */
 }

 .dash-orders .ant-card-body {
+  display: flex;
+  flex-direction: column;
+  height: 100%;
 }
 .dash-orders__list { flex: 1 1 auto; }
 .dash-orders__all  { margin-top: auto; }   /* "View all orders" stays at the bottom */


