"MBW_EXACT_VISUAL_OS_WRAPPED";
import { withMBWExactVisualOS } from "../../app/runtime/MBWExactVisualOS";
// MBW 24E8 src/screens bridge map
// Real visual owner remains the target screen below.
import Screen from "../../app/screens/Sections/KamashastraResultScreen";
import MBWSingleAppVisualBody from '../../app/components/MBWSingleAppVisualBody';

// MBW_24E26B_VISUAL_OWNER_REPAIR
export default withMBWExactVisualOS(function KamashastraResultScreenMBWVisualOwned(props) {
  return <MBWSingleAppVisualBody screenName="KamashastraResultScreen">
      <Screen {...props} />
    </MBWSingleAppVisualBody>;
}, {
  screenId: "KamashastraResultScreen"
});
