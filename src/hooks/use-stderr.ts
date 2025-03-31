import {useContext} from 'preact/hooks';
import StderrContext from '../components/StderrContext.js';

/**
 * `useStderr` is a React hook, which exposes stderr stream.
 */
const useStderr = () => useContext(StderrContext);
export default useStderr;
