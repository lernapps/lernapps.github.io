#!/usr/bin/env bash
# Baut die Architektur-Doku mit docToolchain v4 (noch unveröffentlicht).
# Aufruf: scripts/dtc-v4.sh generateSite
#
# v4.0.0 hat noch kein Release-Zip. Deshalb holt das Skript einen festen Commit von
# main-4.x nach ~/.doctoolchain/docToolchain-<DTC_VERSION>, baut dort lib/ und ruft
# dtcw mit genau dieser Version auf. dtcw erkennt die Installation an lib/ und lädt
# nichts herunter. Sobald v4.0.0 erscheint: Skript löschen, DTC_VERSION in dtcw nutzen.
set -euo pipefail

DTC_REPO_URL="https://github.com/docToolchain/docToolchain.git"
DTC_BRANCH="main-4.x"
DTC_SHA="6de96fb72d9b2d9134c14368c5f19aa79a293567"

# Eigener Versionsname pro Commit: kollidiert weder mit "latest" noch mit einem späteren 4.0.0-Release.
export DTC_VERSION="4.0.0-${DTC_SHA:0:8}"
dtc_home="${HOME}/.doctoolchain/docToolchain-${DTC_VERSION}"   # so berechnet dtcw DTC_HOME

if [ ! -d "${dtc_home}/.git" ]; then
    git clone --quiet --branch "${DTC_BRANCH}" "${DTC_REPO_URL}" "${dtc_home}"
fi
if [ "$(git -C "${dtc_home}" rev-parse HEAD)" != "${DTC_SHA}" ]; then
    git -C "${dtc_home}" fetch --quiet origin "${DTC_BRANCH}"
    git -C "${dtc_home}" -c advice.detachedHead=false checkout --quiet "${DTC_SHA}"
    rm -rf "${dtc_home}/lib"
fi
if ! compgen -G "${dtc_home}/lib/*.jar" > /dev/null; then
    (cd "${dtc_home}" && ./gradlew packageLibs --no-daemon --quiet)
    mkdir -p "${dtc_home}/lib"
    mv "${dtc_home}"/build/lib/*.jar "${dtc_home}/lib/"   # mv statt cp: halbiert den CI-Cache
fi

cd "$(dirname "$0")/.."
node scripts/dashboard.js   # Kennzahlen der Übersichtsseite, git-ignoriert (ADR-031)
exec ./dtcw local "$@"
