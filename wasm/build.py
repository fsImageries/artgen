import argparse
import subprocess
from os.path import sep

from pprint import pprint


help_str = [
    """The filename for the input and output file.
It will locate the files automatically by searching in the assembly directory 
for the input and will put the generated file into the build folder.
    """,
    "The input file. Output name will be extracted automatically.",
    "The output file. Input has to be given."
]


def parse_args():
    parser = argparse.ArgumentParser(description="ASC build script.", formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument("filename", type=str, help=help_str[0])
    parser.add_argument("-x", "--npx", action="store_true", help="Determine if npx should be used.")

    args = parser.parse_args()

    return args


def checks():
    resp = subprocess.run(["asc", "--version"],
                          shell=True, capture_output=True)
    if (resp.returncode == 1):
        raise ValueError("AssemblyScript Compiler (asc) not installed.")


def build_cmd(filename: str, npx:bool):
    cmd = f"{'npx ' if npx else ''}asc"
    inp = f".{sep}assembly{sep}{filename}.ts"
    out = f"--binaryFile .{sep}build{sep}{filename}.wasm"
    args = "--target release --exportRuntime --transform as-bind"

    cmd = " ".join([cmd, inp, out, args])
    print(cmd)
    subprocess.run(cmd, shell=True)


if __name__ == "__main__":
    args = parse_args()

    checks()
    build_cmd(args.filename, args.npx)
