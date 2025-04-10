import {useContext} from 'preact/hooks';
import StdoutContext from '../components/StdoutContext.js';

/**
 * `useStdout` is a React hook, which exposes stdout stream.
 */
const useStdout = () => useContext(StdoutContext);
export default useStdout;
