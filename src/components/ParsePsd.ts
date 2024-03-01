import Psd from "@webtoon/psd"
async function ParsePsd(f: File) {
    const buffer = await f.arrayBuffer();
    const model = Psd.parse(buffer)
}

export default ParsePsd